const History = require("../models/HistoryModel");

exports.fetchSalesHistory = async (req, res, next) => {
	try {
		let criteria = req.body;
		let invoices = await History.fetchSalesHistory(criteria);
		res.status(200).send(invoices);
	} catch (error) {
		next(error);
	}
};

exports.fetchDeletedHistory = async (req, res, next) => {
	try {
		let criteria = req.body;
		let invoices = await History.fetchDeletedHistory(criteria);
		res.status(200).send(invoices);
	} catch (error) {
		next(error);
	}
};

exports.fetchPaymentHistory = async (req, res, next) => {
	try {
		let criteria = req.body;
		let payments = await History.fetchPaymentHistory(criteria);
		res.status(200).send(payments);
	} catch (error) {
		next(error);
	}
};

exports.fetchUserMoneyTransferHistory = async (req, res, next) => {
	try {
		const criteria = req.body;
		let transfers = await History.fetchUserMoneyTransferHistory(criteria);
		res.status(200).send(transfers);
	} catch (error) {
		next(error);
	}
};

exports.fetchReturnHistory = async (req, res, next) => {
	try {
		const criteria = req.body;
		let returns = await History.fetchReturnHistory(criteria);
		res.status(200).send(returns);
	} catch (error) {
		next(error);
	}
};

exports.fetchPurchaseHistory = async (req, res, next) => {
	try {
		const criteria = req.body;
		let supplies = await History.fetchPurchaseHistory(criteria);
		res.status(200).send(supplies);
	} catch (error) {
		next(error);
	}
};

exports.fetchReceiptHistory = async (req, res, next) => {
	try {
		const criteria = req.body;
		let receipts = await History.fetchReceiptHistory(criteria);
		res.status(200).send(receipts);
	} catch (error) {
		next(error);
	}
};
