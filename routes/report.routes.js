const express = require("express");
const router = express.Router();

const ReportController = require("../controllers/ReportController");

router.get("/categories/:start&:end", ReportController.getTopCategories);
router.get("/revenue/:start/:end", ReportController.getRevenue);
router.get("/top-sales/:start&:end&:id", ReportController.getTopSales);

module.exports = router;
