const pool = require("../config/database");
const Accounts = require("./AccountsModel");
// const moment = require("moment");
const moment = require("moment-timezone");

class SellOrders {
	// add order
	static async addOrder(order, items) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();

			moment.tz.setDefault("Asia/Beirut");
			order.order_datetime = moment(order.order_datetime).format(
				`YYYY-MM-DD HH:mm:ss`
			);

			// delete operation type
			let operation_type = order.operation_type;
			delete order.operation_type;

			let journal_voucher;
			if (order.customer_id && operation_type == "debt") {
				//insert transactions to new journal_items approch
				let query = `INSERT INTO journal_vouchers (journal_date, journal_description, total_value) VALUES (?, ?, ?)`;
				[journal_voucher] = await connection.query(query, [
					order.order_datetime,
					"Invoice",
					order.total_amount,
				]);
				order.journal_voucher_id = journal_voucher.insertId;

				let [_4111] = await Accounts.getIdByAccountNumber("4111");

				const firstItem = {
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
					firstItem
				);

				let [_7011] = await Accounts.getIdByAccountNumber("7011");
				const secondItem = {
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
					secondItem
				);
				if (order.vat_value > 0) {
					let [_44271] = await Accounts.getIdByAccountNumber("44271");
					const thirdItem = {
						journal_id_fk: journal_voucher.insertId,
						journal_date: order.order_datetime,
						account_id_fk: _44271.id,
						reference_number: order.reference_number,
						partner_id_fk: null,
						currency: "USD",
						debit: 0,
						credit: order.vat_value,
						exchange_value: order.exchange_rate,
					};
					await connection.query(
						`INSERT INTO journal_items SET ?`,
						thirdItem
					);
				}
			}

			// console.log(order);
			delete order.send_whatsapp;
			console.log(order);
			
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
			if (order.customer_id && operation_type == "debt") {
				await connection.query(
					`UPDATE journal_vouchers SET journal_number = ? WHERE journal_id = ?`,
					[invoice_number, journal_voucher.insertId]
				);
			}

			let invoice_map = Array.from(items).map(function (item) {
				return [
					order_id,
					item.product_id,
					item.quantity,
					item.unit_price,
					item.price_type,
					item.unit_cost,
					item.quantity * item.unit_price,
				];
			});

			await connection.query(
				`INSERT INTO sales_order_items (order_id, product_id, quantity,  unit_price, price_type,unit_cost, total_price ) VALUES ?`,
				[invoice_map]
			);

			// modify qty for stock managed items

			if (items.length > 0) {
				let queries = "";
				let product_id = null;
				let quantity = null;
				let params = [];
				items.forEach((element) => {
					console.log(element);
					
					if (element.stock_management == 1) {
						product_id = element["product_id"];
						quantity = element["quantity"];
						params = params.concat([
							product_id,
							quantity,
							order_id,
							invoice_number,
						]);
						//add order_items to inventory transactions
						queries += `INSERT INTO inventory_transactions (product_id_fk, quantity, transaction_type, order_id_fk, transaction_notes) VALUES (?, -?, 'SALE', ?, ?);`;
					}
				});
				if(queries) {
					await connection.query(queries, params);
				}
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

			// update inventory qty for deleted items
			let inventoryQueries = "";
			let product_id = null;
			let quantity = null;

			// add deleted items to inventory transactions
			await connection.query(
				`DELETE FROM inventory_transactions WHERE order_id_fk = ? AND transaction_type = 'SALE'`,
				[order_id]
			);

			//add order_items to inventory transactions
			items.forEach((element) => {
				product_id = element.product_id;
				quantity = element.quantity;
				// update inventory
				inventoryQueries += `INSERT INTO inventory_transactions (product_id_fk, transaction_type, quantity, order_id_fk, transaction_notes) VALUES (${product_id}, 'SALE', -${quantity}, ${order_id}, '${orderCheck.invoice_number}');`;
			});
			await connection.query(inventoryQueries);

			if (orderCheck.customer_id) {
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
			let deleteItemsQuery = `DELETE FROM sales_order_items WHERE order_id = ?`;
			await connection.query(deleteItemsQuery, order_id);

			// delete old invoice
			let deleteOrderQuery = `DELETE FROM sales_orders WHERE order_id = ?`;
			await connection.query(deleteOrderQuery, order_id);

			// insert the new order

			// fix date
			order.order_datetime = moment(order.order_datetime).format(
				`YYYY-MM-DD HH:mm:ss`
			);

			// fix invoice number
			order.invoice_number = `INV${order.invoice_number.padStart(
				4,
				"0"
			)}`;

			// add vouchers if customer is selected
			if (order.customer_id) {
				//insert to vouchers and journal_items
				let query = `INSERT INTO journal_vouchers (journal_id, journal_number, journal_date, journal_description, total_value) VALUES (?, ?, ?, ?, ?)`;
				const [journal_voucher] = await connection.query(query, [
					orderCheck.journal_voucher_id,
					order.invoice_number,
					order.order_datetime,
					"Invoice",
					order.total_amount,
				]);
				order.journal_voucher_id = journal_voucher.insertId;

				let [_4111] = await Accounts.getIdByAccountNumber("4111");

				const firstItem = {
					journal_id_fk: journal_voucher.insertId,
					journal_date: order.order_datetime,
					account_id_fk: _4111.id,
					reference_number: order.reference_number,
					partner_id_fk: order.customer_id,
					currency: "USD",
					debit: order.total_amount,
					credit: 0,
				};

				await connection.query(
					`INSERT INTO journal_items SET ?`,
					firstItem
				);

				let [_7011] = await Accounts.getIdByAccountNumber("7011");
				const secondItem = {
					journal_id_fk: journal_voucher.insertId,
					journal_date: order.order_datetime,
					account_id_fk: _7011.id,
					reference_number: order.reference_number,
					partner_id_fk: null,
					currency: "USD",
					debit: 0,
					credit: order.total_amount,
				};

				await connection.query(
					`INSERT INTO journal_items SET ?`,
					secondItem
				);
				if (order.vat_value > 0) {
					let [_44271] = await Accounts.getIdByAccountNumber("44271");
					const thirdItem = {
						journal_id_fk: journal_voucher.insertId,
						journal_date: order.order_datetime,
						account_id_fk: _44271.id,
						reference_number: order.reference_number,
						partner_id_fk: null,
						currency: "USD",
						debit: 0,
						credit: order.vat_value,
					};
					await connection.query(
						`INSERT INTO journal_items SET ?`,
						thirdItem
					);
				}
			}

			order.exchange_rate = orderCheck.exchange_rate;
			// insert query
			await connection.query(`INSERT INTO sales_orders SET ?`, order);

			let invoice_map = Array.from(items).map(function (item) {
				return [
					order_id,
					item.product_id,
					item.quantity,
					item.unit_price,
					item.price_type,
					item.unit_cost,
					item.quantity * item.unit_price,
				];
			});

			const [new_order] = await connection.query(
				`INSERT INTO sales_order_items (order_id, product_id, quantity,  unit_price, price_type,unit_cost, total_price ) VALUES ?`,
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

			if (orderCheck.customer_id && orderCheck.journal_voucher_id) {
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
			let deleteItemsQuery = `DELETE FROM sales_order_items WHERE order_id = ?`;
			await connection.query(deleteItemsQuery, order_id);

			// delete old invoice
			let deleteOrderQuery = `DELETE FROM sales_orders WHERE order_id = ?`;
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
