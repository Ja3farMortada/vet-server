const Payment = require("../models/PaymentModel");

exports.addCustomerPayment = async (req, res, next) => {
	try {
		const paymentData = req.body;
		const result = await Payment.addCustomerPayment(paymentData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
exports.editCustomerPayment = async (req, res, next) => {
	try {
		const paymentData = req.body;
		const result = await Payment.editCustomerPayment(paymentData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

exports.deletePayment = async (req, res, next) => {
	try {
		const payment_id = req.params.payment_id;
		const result = await Payment.deletePayment(payment_id);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

exports.addSupplierPayment = async (req, res, next) => {
	try {
		const paymentData = req.body;
		const result = await Payment.addSupplierPayment(paymentData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

exports.editSupplierPayment = async (req, res, next) => {
	try {
		const paymentData = req.body;
		const result = await Payment.editSupplierPayment(paymentData);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
