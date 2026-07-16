const ReturnModel = require("../models/ReturnModel");

// create a return — body: { invoice: { ...order, items: [...] }, payment: {...}|null }
exports.addReturn = async (req, res, next) => {
    try {
        const order = req.body.invoice;
        const payment = req.body.payment || null;
        const items = order.items || [];
        delete order.items;

        const { order_id } = await ReturnModel.createReturn(order, items, payment);
        const created = await ReturnModel.getReturnById(order_id);
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};

// edit a return — body: the order incl. items + update_reason
exports.editReturn = async (req, res, next) => {
    try {
        const order = req.body;
        const order_id = order.order_id;
        const items = order.items || [];
        delete order.items;
        delete order.order_id;

        await ReturnModel.updateReturn(order_id, order, items);
        const updated = await ReturnModel.getReturnById(order_id);
        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

// soft-delete a return — DELETE /return/:order_id?message=reason
exports.deleteReturn = async (req, res, next) => {
    try {
        const { order_id } = req.params;
        const { message } = req.query;
        await ReturnModel.deleteReturn(order_id, message);
        res.status(200).json({ message: "Return deleted successfully" });
    } catch (error) {
        next(error);
    }
};
