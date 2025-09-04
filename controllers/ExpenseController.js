const Expense = require("../models/ExpenseModel");

exports.getExpenseDetails = async (req, res, next) => {
	try {
		const expenses = await Expense.getExpenseDetails();
		res.json(expenses);
	} catch (err) {
		next(err);
	}
};

exports.getExpenseAccounts = async (req, res, next) => {
	try {
		const accounts = await Expense.getExpenseAccounts();
		res.json(accounts);
	} catch (err) {
		next(err);
	}
};

exports.createExpense = async (req, res, next) => {
	try {
		const data = req.body;
		await Expense.createExpense(data);
		res.json({ message: "Expense created successfully" });
	} catch (err) {
		next(err);
	}
};
exports.updateExpense = async (req, res, next) => {
	try {
		const data = req.body;
		await Expense.updateExpense(data);
		res.json({ message: "Expense updated successfully" });
	} catch (err) {
		next(err);
	}
};

exports.deleteExpense = async (req, res, next) => {
	try {
		const { payment_id } = req.params;
		const { message } = req.query;

		const result = await Expense.deleteExpense(payment_id, message);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

// edits history
exports.fetchEditHistory = async (req, res, next) => {
	try {
		const { id } = req.params;
		const data = await Expense.fetchEditHistory(id);
		res.status(200).send(data);
	} catch (error) {
		next(error);
	}
};

// get deleted expenses
exports.getDeletedExpenses = async (req, res, next) => {
	try {
		const data = await Expense.fetchDeletedHistory();
		res.status(200).send(data);
	} catch (error) {
		next(error);
	}
};
