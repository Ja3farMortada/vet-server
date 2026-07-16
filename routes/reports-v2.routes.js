const express = require("express");
const router = express.Router();

const ReportsV2Controller = require("../controllers/ReportsV2Controller");

// Reports v2 — versioned, aggregate-per-page endpoints. The legacy /report/*
// routes are untouched; these are additive.
router.post("/overview", ReportsV2Controller.getOverview);
router.post("/financial", ReportsV2Controller.getFinancial);
router.post("/segments", ReportsV2Controller.getSegments);
router.post("/products/table", ReportsV2Controller.getProductsTable);
router.post("/products/insights", ReportsV2Controller.getProductsInsights);
router.post("/product-history", ReportsV2Controller.getProductHistory);
router.post("/discounts", ReportsV2Controller.getDiscounts);
router.post("/heatmap", ReportsV2Controller.getHeatmap);
router.post("/inventory", ReportsV2Controller.getInventory);

module.exports = router;
