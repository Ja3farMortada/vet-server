const express = require("express");
const router = express.Router();

const HistoryController = require("../controllers/HistoryController");

router.post("/sales/search", HistoryController.fetchSalesHistory);
router.post("/deleted/search", HistoryController.fetchDeletedHistory);
router.get("/edits/:id", HistoryController.fetchEditHistory);
router.post("/payment/search", HistoryController.fetchPaymentHistory);
router.post(
	"/money-transfer/search",
	HistoryController.fetchUserMoneyTransferHistory
);
router.post("/return/search", HistoryController.fetchReturnHistory);
router.post("/purchase/search", HistoryController.fetchPurchaseHistory);
router.post("/receipt/search", HistoryController.fetchReceiptHistory);

router.post("/products/search", HistoryController.fetchProductsSalesHistory);

module.exports = router;
