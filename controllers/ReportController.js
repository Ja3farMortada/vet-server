const ReportModel = require("../models/ReportModel");

exports.getTotalSales = async (req, res, next) => {
    try {
        const { start, end } = req.params;
        const result = await ReportModel.getTotalSales(start, end);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
