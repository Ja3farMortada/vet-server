const PurchaseOrders = require("../models/PurchaseModel");

// add order
exports.addOrder = async (req, res, next) => {
	try {
		const order = req.body.invoice;
		const items = order.items;
		const payment = req.body.payment;

		delete order.items;

		const result = await PurchaseOrders.addOrder(order, items, payment);
		const new_order = await PurchaseOrders.getAddedOrderById(result.order);
		res.status(201).json(new_order);
	} catch (error) {
		next(error);
	}
};
exports.editOrder = async (req, res, next) => {
	try {
		const order = req.body;
		const items = order.items;
		delete order.items;

		const result = await PurchaseOrders.editOrder(order, items);
		const new_order = await PurchaseOrders.getAddedOrderById(
			result.insertId
		);
		res.status(201).json(new_order);
	} catch (error) {
		next(error);
	}
};
exports.deleteOrder = async (req, res, next) => {
	try {
		const order_id = req.params.id;
		await PurchaseOrders.deleteOrder(order_id);
		res.status(200).json({ message: "Order deleted successfully" });
	} catch (error) {
		next(error);
	}
};
