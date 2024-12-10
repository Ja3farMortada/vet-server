const Customer = require("../models/CustomersModel");
const Accounts = require("../models/AccountsModel");

// get customers
exports.getAllCustomers = async (req, res, next) => {
	try {
		const customers = await Customer.getAllCustomers();
		res.status(200).json(customers);
	} catch (error) {
		next(error);
	}
};

// get customer by id
exports.getCustomerById = async (req, res, next) => {
	const id = req.params.id;
	try {
		const customer = await Customer.getCustomerById(id);
		res.status(200).json(customer);
	} catch (error) {
		next(error);
	}
};

// create customer
exports.createCustomer = async (req, res, next) => {
	const data = req.body;
	try {
		const { insertId } = await Customer.createCustomer(data);
		const customer = await Customer.getCustomerById(insertId);
		res.status(201).json({
			message: "Customer created successfully",
			customer,
		});
	} catch (error) {
		next(error);
	}
};

// update customer
exports.updateCustomer = async (req, res, next) => {
	const id = req.params.id;
	const data = req.body;
	try {
		const result = await Customer.updateCustomer(id, data);
		const customer = await Customer.getCustomerById(id);
		res.status(201).json({
			message: "Customer updated successfully",
			customer,
		});
	} catch (error) {
		next(error);
	}
};

// delete customer
exports.deleteCustomer = async (req, res, next) => {
	const id = req.params.id;
	try {
		const result = await Customer.deleteCustomer(id);
		res.status(201).json({ message: "Customer deleted successfully" });
	} catch (error) {
		next(error);
	}
};

// get customer's debts
exports.getCustomerDebts = async (req, res, next) => {
	try {
		const result = await Customer.getCustomerDebts();
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

// get customer balance
exports.getCustomerBalance = async (req, res, next) => {
	const { id, start, end } = req.params;
	try {
		const balance = await Accounts.getAccountDetailsById(id, start, end);
		res.status(200).json(balance);
	} catch (error) {
		next(error);
	}
};

exports.getCustomerLatestPurchases = async (req, res, next) => {
	const { id } = req.params;
	try {
		const purchases = await Customer.getCustomerLatestPurchases(id);
		res.status(200).json(purchases);
	} catch (error) {
		next(error);
	}
};

exports.getCustomerTotalBalance = async (req, res, next) => {
	const { id } = req.params;
	try {
		const balance = await Customer.getCustomerTotalBalance(id);
		res.status(200).json({ id, ...balance });
	} catch (error) {
		next(error);
	}
};
