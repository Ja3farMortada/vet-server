const express = require("express");
const router = express.Router();

const ReportController = require("../controllers/ReportController");

router.get("/categories/:start&:end", ReportController.getTopCategories);
router.get("/expenses/:start&:end", ReportController.getExpenses);
router.get(
	"/supplier-payments/:start&:end",
	ReportController.getSupplierPayments
);
router.get("/revenue/:start/:end", ReportController.getRevenue);
router.get("/top-sales/:start&:end&:id", ReportController.getTopSales);
router.get("/stock-value", ReportController.getStockValue);

router.get(
	"/product-history/:start&:end&:id&:searchBy",
	ReportController.getProductHistory
);

module.exports = router;
