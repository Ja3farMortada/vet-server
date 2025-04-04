const pool = require("../config/database");
const Accounts = require("./AccountsModel");
// const moment = require("moment");
const moment = require("moment-timezone");

class SellOrders {
	// add order
	static async addOrder(order, items, payment) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();

			let operation_type = order.operation_type;
			delete order.operation_type;

			moment.tz.setDefault("Asia/Beirut");
			order.order_datetime = moment(order.order_datetime).format(
				`YYYY-MM-DD HH:mm:ss`
			);

			// ##############################################################################################
			// ####################### create journal voucher and journal items #############################
			let query = `INSERT INTO journal_vouchers (journal_date, journal_description, total_value) VALUES (?, ?, ?)`;
			let [journal_voucher] = await connection.query(query, [
				order.order_datetime,
				"Invoice",
				order.total_amount,
			]);
			order.journal_voucher_id = journal_voucher.insertId;

			// create first common journal item entry for sales
			// sales goods account
			let [_7011] = await Accounts.getIdByAccountNumber("7011");
			const salesGood = {
				journal_id_fk: journal_voucher.insertId,
				journal_date: order.order_datetime,
				account_id_fk: _7011.id,
				reference_number: order.reference_number,
				partner_id_fk: null,
				currency: "USD",
				debit: 0,
				credit: order.total_amount,
				exchange_value: order.exchange_rate,
			};
			await connection.query(
				`INSERT INTO journal_items SET ?`,
				salesGood
			);

			// if customer selected
			if (order.customer_id && operation_type == "debt") {
				// ordinary clients account
				let [_4111] = await Accounts.getIdByAccountNumber("4111");
				const ordinaryClients = {
					journal_id_fk: journal_voucher.insertId,
					journal_date: order.order_datetime,
					account_id_fk: _4111.id,
					reference_number: order.reference_number,
					partner_id_fk: order.customer_id,
					currency: "USD",
					debit: order.total_amount,
					credit: 0,
					exchange_value: order.exchange_rate,
				};
				await connection.query(
					`INSERT INTO journal_items SET ?`,
					ordinaryClients
				);
			} else {
				// if no debt applied, add cash to cash account
				// cash account
				let [_531] = await Accounts.getIdByAccountNumber("531");
				const cashDollar = {
					journal_id_fk: journal_voucher.insertId,
					journal_date: order.order_datetime,
					account_id_fk: _531.id,
					reference_number: order.reference_number,
					partner_id_fk: null,
					currency: "USD",
					debit: order.total_amount,
					credit: 0,
					exchange_value: order.exchange_rate,
				};
				await connection.query(
					`INSERT INTO journal_items SET ?`,
					cashDollar
				);
			}

			delete order.send_whatsapp;

			const [result] = await connection.query(
				`INSERT INTO sales_orders SET ?`,
				order
			);

			let order_id = result.insertId;

			// generate invoice_number
			let [[{ number }]] = await connection.query(
				`SELECT IFNULL(MAX(CAST(SUBSTRING(invoice_number, 4) AS UNSIGNED)), 1000) + 1 AS number FROM sales_orders`
			);

			let invoice_number = `INV${number.toString().padStart(4, "0")}`;

			// let invoice_number = invoice.invoice_number;
			await connection.query(
				`UPDATE sales_orders SET invoice_number = ? WHERE order_id = ?`,
				[invoice_number, order_id]
			);

			// update journal voucher number
			await connection.query(
				`UPDATE journal_vouchers SET journal_number = ? WHERE journal_id = ?`,
				[invoice_number, journal_voucher.insertId]
			);

			let invoice_map = Array.from(items).map(function (item) {
				return [
					order_id,
					item.product_id,
					item.quantity,
					item.original_price,
					item.unit_price,
					((item.original_price - item.unit_price) /
						item.original_price) *
						100,
					item.price_type,
					item.unit_cost,
					item.quantity * item.unit_price,
					item.variant_id,
				];
			});

			await connection.query(
				`INSERT INTO sales_order_items (order_id, product_id, quantity, original_price, unit_price, discount_percentage, price_type, unit_cost, total_price, variant_id ) VALUES ?`,
				[invoice_map]
			);

			// modify qty for stock managed items

			if (items.length > 0) {
				let queries = "";
				let product_id = null;
				let variant_id = null;
				let quantity = null;
				let params = [];

				items.forEach((element) => {
					if (element.stock_management == 1) {
						product_id = element["product_id"];
						variant_id = element["variant_id"] || null;
						quantity = element["quantity"];
						params = params.concat([
							product_id,
							variant_id,
							quantity,
							order_id,
							invoice_number,
						]);
						//add order_items to inventory transactions
						queries += `INSERT INTO inventory_transactions (product_id_fk, variant_id, quantity, transaction_type, order_id_fk, transaction_notes) VALUES (?, ?, -?, 'SALE', ?, ?);`;
					}
				});
				if (queries) {
					await connection.query(queries, params);
				}
			}

			if (payment) {
				payment.payment_date = moment(payment.payment_date)
					.add(1, "seconds")
					.format(`YYYY-MM-DD HH:mm:ss`);

				let [[{ number }]] = await connection.query(
					`SELECT IFNULL(MAX(CAST(SUBSTRING(journal_number , 4) AS UNSIGNED)), 1000) + 1 AS number FROM journal_vouchers jv where journal_number like 'PAY%'`
				);

				let payment_number = `PAY${number.toString().padStart(4, "0")}`;

				//insert to vouchers and journal_items
				let query = `INSERT INTO journal_vouchers (journal_number, journal_date, journal_description, total_value) VALUES (?, ?, ?, ?)`;
				const [journal_voucher] = await connection.query(query, [
					payment_number,
					payment.payment_date,
					"Payment",
					payment.amount,
				]);

				let [_531] = await Accounts.getIdByAccountNumber("531");

				const firstItem = {
					journal_id_fk: journal_voucher.insertId,
					journal_date: payment.payment_date,
					account_id_fk: _531.id,
					reference_number: payment.reference_number,
					partner_id_fk: null,
					currency: "USD",
					debit: payment.amount,
					credit: 0,
					exchange_value: payment.exchange_rate,
				};

				await connection.query(
					`INSERT INTO journal_items SET ?`,
					firstItem
				);

				let [_413] = await Accounts.getIdByAccountNumber("413");
				const secondItem = {
					journal_id_fk: journal_voucher.insertId,
					journal_date: payment.payment_date,
					account_id_fk: _413.id,
					reference_number: payment.reference_number,
					partner_id_fk: payment.customer_id,
					currency: "USD",
					debit: 0,
					credit: payment.amount,
					exchange_value: payment.exchange_rate,
				};
				await connection.query(
					`INSERT INTO journal_items SET ?`,
					secondItem
				);
			}

			await connection.commit();
			return { order: order_id };
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	// edit order
	static async editOrder(order, items) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();

			let order_id = order.order_id;

			//check existing order for user
			let [[orderCheck]] = await connection.query(
				`SELECT * FROM sales_orders WHERE order_id = ?`,
				[order_id]
			);
			if (!orderCheck) throw new Error("Order not found");

			// check journal item record for account number 2 that check if order was debt or normal
			let [[journalItem]] = await connection.query(
				`SELECT * FROM journal_items WHERE journal_id_fk = ? AND account_id_fk = 2`,
				orderCheck.journal_voucher_id
			);

			let wasDebt = false;
			if (journalItem) {
				wasDebt = true;
			}

			// delete items from inventory transactions
			await connection.query(
				`DELETE FROM inventory_transactions WHERE order_id_fk = ? AND transaction_type = 'SALE'`,
				[order_id]
			);

			// update inventory qty for deleted items
			let inventoryQueries = "";
			let product_id = null;
			let variant_id = null;
			let quantity = null;

			// add order_items to inventory transactions
			items.forEach((element) => {
				product_id = element.product_id;
				variant_id = element["variant_id"] || null;
				quantity = element.quantity;

				// update inventory
				inventoryQueries += `INSERT INTO inventory_transactions (product_id_fk, variant_id, transaction_type, quantity, order_id_fk, transaction_notes) VALUES (${product_id}, ${variant_id}, 'SALE', -${quantity}, ${order_id}, '${orderCheck.invoice_number}');`;
			});
			await connection.query(inventoryQueries);

			// if (orderCheck.customer_id && orderCheck.journal_voucher_id) {
			//delete voucher and items
			let deleteVoucherQuery = `DELETE FROM journal_vouchers WHERE journal_id = ?`;
			await connection.query(
				deleteVoucherQuery,
				orderCheck.journal_voucher_id
			);

			let deleteJournalItemsQuery = `DELETE FROM journal_items WHERE journal_id_fk = ?`;
			await connection.query(
				deleteJournalItemsQuery,
				orderCheck.journal_voucher_id
			);
			// }

			// delete old items
			let deleteItemsQuery = `DELETE FROM sales_order_items WHERE order_id = ?`;
			await connection.query(deleteItemsQuery, order_id);

			// delete old invoice
			let deleteOrderQuery = `DELETE FROM sales_orders WHERE order_id = ?`;
			await connection.query(deleteOrderQuery, order_id);

			// ##############################################################################################
			// ####################### create journal voucher and journal items #############################
			let query = `INSERT INTO journal_vouchers (journal_date, journal_description, total_value) VALUES (?, ?, ?)`;
			let [journal_voucher] = await connection.query(query, [
				order.order_datetime,
				"Invoice",
				order.total_amount,
			]);
			order.journal_voucher_id = journal_voucher.insertId;

			// create first common journal item entry for sales
			// sales goods account
			let [_7011] = await Accounts.getIdByAccountNumber("7011");
			const salesGood = {
				journal_id_fk: journal_voucher.insertId,
				journal_date: order.order_datetime,
				account_id_fk: _7011.id,
				reference_number: order.reference_number,
				partner_id_fk: null,
				currency: "USD",
				debit: 0,
				credit: order.total_amount,
				exchange_value: order.exchange_rate,
			};
			await connection.query(
				`INSERT INTO journal_items SET ?`,
				salesGood
			);

			// if customer selected
			if (order.customer_id && wasDebt) {
				// ordinary clients account
				let [_4111] = await Accounts.getIdByAccountNumber("4111");
				const ordinaryClients = {
					journal_id_fk: journal_voucher.insertId,
					journal_date: order.order_datetime,
					account_id_fk: _4111.id,
					reference_number: order.reference_number,
					partner_id_fk: order.customer_id,
					currency: "USD",
					debit: order.total_amount,
					credit: 0,
					exchange_value: order.exchange_rate,
				};
				await connection.query(
					`INSERT INTO journal_items SET ?`,
					ordinaryClients
				);
			} else {
				// if no debt applied, add cash to cash account
				// cash account
				let [_531] = await Accounts.getIdByAccountNumber("531");
				const cashDollar = {
					journal_id_fk: journal_voucher.insertId,
					journal_date: order.order_datetime,
					account_id_fk: _531.id,
					reference_number: order.reference_number,
					partner_id_fk: null,
					currency: "USD",
					debit: order.total_amount,
					credit: 0,
					exchange_value: order.exchange_rate,
				};
				await connection.query(
					`INSERT INTO journal_items SET ?`,
					cashDollar
				);
			}

			// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			// ++++++++++++++++++ Insert the new order +++++++++++++++++++++++

			// fix date
			order.order_datetime = moment(order.order_datetime).format(
				`YYYY-MM-DD HH:mm`
			);

			// fix invoice number
			order.invoice_number = `INV${order.invoice_number.padStart(
				4,
				"0"
			)}`;

			// update journal voucher number
			await connection.query(
				`UPDATE journal_vouchers SET journal_number = ? WHERE journal_id = ?`,
				[order.invoice_number, order.journal_voucher_id]
			);

			// update journal voucher number
			await connection.query(
				`UPDATE journal_vouchers SET journal_number = ? WHERE journal_id = ?`,
				[order.invoice_number, order.journal_voucher_id]
			);

			order.exchange_rate = orderCheck.exchange_rate;
			// insert query
			await connection.query(`INSERT INTO sales_orders SET ?`, order);

			let invoice_map = Array.from(items).map(function (item) {
				return [
					order_id,
					item.product_id,
					item.variant_id,
					item.quantity,
					item.original_price,
					item.unit_price,
					((item.original_price - item.unit_price) /
						item.original_price) *
						100,
					item.price_type,
					item.unit_cost,
					item.quantity * item.unit_price,
				];
			});

			const [new_order] = await connection.query(
				`INSERT INTO sales_order_items (order_id, product_id, variant_id, quantity, original_price, unit_price, discount_percentage, price_type,unit_cost, total_price ) VALUES ?`,
				[invoice_map]
			);

			await connection.commit();
			return new_order.insertId;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	// delete invoice
	static async deleteOrder(order_id) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();

			//check existing order for user
			let [[orderCheck]] = await connection.query(
				`
				SELECT * FROM sales_orders WHERE order_id = ?`,
				[order_id]
			);
			if (!orderCheck) throw new Error("Order not found");

			// add deleted items to inventory transactions
			await connection.query(
				`INSERT INTO inventory_transactions (product_id_fk, transaction_type, quantity) SELECT product_id, 'DELETE', quantity FROM sales_order_items WHERE order_id = ?`,
				[order_id]
			);

			if (orderCheck.journal_voucher_id) {
				//delete voucher and items
				let deleteVoucherQuery = `DELETE FROM journal_vouchers WHERE journal_id = ?`;
				await connection.query(
					deleteVoucherQuery,
					orderCheck.journal_voucher_id
				);

				let deleteJournalItemsQuery = `DELETE FROM journal_items WHERE journal_id_fk = ?`;
				await connection.query(
					deleteJournalItemsQuery,
					orderCheck.journal_voucher_id
				);
			}

			// delete old items
			let deleteItemsQuery = `UPDATE sales_order_items SET is_deleted = 1 WHERE order_id = ?`;
			await connection.query(deleteItemsQuery, order_id);

			// delete old invoice
			let deleteOrderQuery = `UPDATE sales_orders SET is_deleted = 1 WHERE order_id = ?`;
			await connection.query(deleteOrderQuery, order_id);

			await connection.commit();
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	// get added order
	static async getAddedOrderById(order_id) {
		const [order] = await pool.query(
			`SELECT * FROM sales_orders WHERE order_id = ?`,
			[order_id]
		);
		return order;
	}
}

module.exports = SellOrders;
