const ReportModel = require("../models/ReportModel");

exports.getRevenue = async (req, res, next) => {
	try {
		const { start, end } = req.params;
		const result = await ReportModel.getRevenue(start, end);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

exports.getTopSales = async (req, res, next) => {
	try {
		const { start, end, id } = req.params;
		const result = await ReportModel.getTopSales(start, end, id);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};
