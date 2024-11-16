const express = require("express");
const router = express.Router();

const ReportController = require("../controllers/ReportController");

router.get("/total-sales/:start/:end", ReportController.getTotalSales);
// router.get("/top-sales/:start&:end&:id", ReportController.getTopSales);

module.exports = router;
