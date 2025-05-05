const express = require("express");
const router = express.Router();
// const { admin } = require("../middleware/auth");

const CustomersController = require("../controllers/CustomersController");

router.get("/debts", CustomersController.getCustomerDebts);
router.get("/", CustomersController.getAllCustomers);
router.get("/:id", CustomersController.getCustomerById);
router.post("/", CustomersController.createCustomer);
router.put("/:id", CustomersController.updateCustomer);
router.delete("/:id", CustomersController.deleteCustomer);

router.get(
	"/transactions/:id&:start&:end",
	CustomersController.getCustomerBalance
);

router.get(
	"/:id/purchases/latest",
	CustomersController.getCustomerLatestPurchases
);
router.get("/:id/balance", CustomersController.getCustomerTotalBalance);

//admin routes
// router.use(admin);

module.exports = router;
