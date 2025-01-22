const Reports = require("../models/ReportModel");

exports.getRevenue = async (req, res, next) => {
	try {
		const { start, end } = req.params;
		const result = await Reports.getRevenue(start, end);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

exports.getExpenses = async (req, res, next) => {
	try {
		const { start, end } = req.params;
		const result = await Reports.getExpenses(start, end);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

exports.getTopSales = async (req, res, next) => {
	try {
		const { start, end, id } = req.params;
		const result = await Reports.getTopSales(start, end, id);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

exports.getTopCategories = async (req, res, next) => {
	let startDate = req.params.start;
	let endDate = req.params.end;
	try {
		let topCategories = await Reports.getTopCategories(startDate, endDate);
		res.status(200).send(topCategories);
	} catch (error) {
		next(error);
	}
};

// stock value
exports.getStockValue = async (req, res, next) => {
	try {
		let stockValue = await Reports.getStockValue();
		res.status(200).send(stockValue);
	} catch (error) {
		next(error);
	}
};

// product history
exports.getProductHistory = async (req, res, next) => {
	try {
		const { start, end, id } = req.params;
		let productHistory = await Reports.getProductHistory(start, end, id);
		res.status(200).send(productHistory);
	} catch (error) {
		next(error);
	}
};
