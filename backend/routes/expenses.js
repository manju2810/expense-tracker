const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// @route   POST api/expenses
// @desc    Add new expense
router.post('/', auth, async (req, res) => {
  const { description, amount, date } = req.body;
  try {
    const newExpense = new Expense({
      user: req.user.id,
      description,
      amount,
      date
    });
    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/expenses
// @desc    Get all expenses for a user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/expenses/summary
// @desc    Get expense summary for the current month
router.get('/summary', auth, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const numberOfExpenses = expenses.length;

    res.json({ totalAmount, numberOfExpenses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;