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

exports.getGroupedRevenue = async (req, res, next) => {
    try {
        const { start, end } = req.params;
        const result = await Reports.getGroupedRevenue(start, end);
        res.status(200).send(result);
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

exports.getSupplierPayments = async (req, res, next) => {
    try {
        const { start, end } = req.params;
        const result = await Reports.getSupplierPayments(start, end);
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
        const { start, end, id, searchBy } = req.params;

        let productHistory = await Reports.getProductHistory(
            start,
            end,
            id,
            searchBy
        );
        res.status(200).send(productHistory);
    } catch (error) {
        next(error);
    }
};

// -------------------------------------------- get debts --------------------------------------------
exports.getDebts = async (req, res, next) => {
    try {
        const { start, end } = req.params;
        const result = await Reports.getDebts(start, end);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

// get customer payments
exports.getCustomerPayments = async (req, res, next) => {
    try {
        const { start, end } = req.params;
        const result = await Reports.getCustomerPayments(start, end);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

exports.getCashBalance = async (req, res, next) => {
    try {
        const { start, end } = req.params;
        const result = await Reports.getCashBalance(start, end);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};

// get total purchases
exports.getTotalPurchases = async (req, res, next) => {
    try {
        const { start, end } = req.params;
        const result = await Reports.getTotalPurchases(start, end);
        res.status(200).send(result);
    } catch (error) {
        next(error);
    }
};
