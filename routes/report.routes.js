const express = require("express");
const router = express.Router();

const ReportController = require("../controllers/ReportController");

router.get("/categories/:start&:end", ReportController.getTopCategories);
router.get("/expenses/:start&:end", ReportController.getExpenses);

router.get("/revenue/:start/:end", ReportController.getRevenue);
router.get("/revenue-grouped/:start/:end", ReportController.getGroupedRevenue);
router.get("/top-sales/:start&:end&:id", ReportController.getTopSales);
router.get("/stock-value", ReportController.getStockValue);

router.get(
    "/product-history/:start&:end&:id&:searchBy",
    ReportController.getProductHistory
);

// debts
router.get("/debts/:start&:end", ReportController.getDebts);

// customer payments
router.get(
    "/customer-payments/:start&:end",
    ReportController.getCustomerPayments
);

// total purchases
router.get("/total-purchases/:start&:end", ReportController.getTotalPurchases);

// supplier payments
router.get(
    "/supplier-payments/:start&:end",
    ReportController.getSupplierPayments
);

// cash balance
router.get("/cash/:start&:end", ReportController.getCashBalance);

module.exports = router;
