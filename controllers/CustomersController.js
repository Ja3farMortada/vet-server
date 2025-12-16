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
    try {
        const io = req.io;
        const user = req.user;
        const data = req.body;

        const { insertId } = await Customer.createCustomer(data);
        const customer = await Customer.getCustomerById(insertId);

        console.log(user);

        // emit socket
        io.emit("customerCreated", [customer, user]);

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
    try {
        const io = req.io;
        const user = req.user;
        const id = req.params.id;
        const data = req.body;
        await Customer.updateCustomer(id, data);
        const customer = await Customer.getCustomerById(id);

        // emit socket
        io.emit("customerUpdated", [customer, user]);

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
    try {
        const io = req.io;
        const user = req.user;
        const id = req.params.id;
        const customer = await Customer.getCustomerById(id);
        await Customer.deleteCustomer(id);

        // emit socket
        io.emit("customerDeleted", [customer, user]);

        res.status(201).json({ message: "Customer deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// get customer's debts
exports.getCustomerDebts = async (req, res, next) => {
    try {
        const { start_date, end_date } = req.params;

        const result = await Customer.getCustomerDebts(start_date, end_date);
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

exports.fetchCustomerPets = async (req, res, next) => {
    const { customer_id } = req.params;
    try {
        const pets = await Customer.getCustomerPets(customer_id);
        res.status(200).send(pets);
    } catch (error) {
        next(error);
    }
};
