import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState({ totalAmount: 0, numberOfExpenses: 0 });
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [monthlyTarget, setMonthlyTarget] = useState(0);


  const categoryOptions = {
    Food: ["Groceries", "Restaurant", "Snacks", "Other"],
    Travel: ["Bus", "Train", "Flight", "Fuel", "Other"],
    Shopping: ["Clothes", "Electronics", "Accessories", "Other"],
    Rent: ["House Rent", "Hostel Rent", "Other"],
    Bills: ["Electricity", "Water", "Internet", "Other"],
    Other: ["Other"]
  };

  const getToken = () => localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchUserData = async () => {
    const config = { headers: { 'x-auth-token': getToken() } };
    const res = await axios.get('http://localhost:5000/api/auth', config);
    setUserName(res.data.name);
  };

  const fetchSummary = async () => {
    const config = { headers: { 'x-auth-token': getToken() } };
    const res = await axios.get('http://localhost:5000/api/expenses/summary', config);
    setSummary(res.data);
  };

  const fetchExpenses = async () => {
    const config = { headers: { 'x-auth-token': getToken() } };
    const res = await axios.get('http://localhost:5000/api/expenses', config);
    setExpenses(res.data);
  };

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
    } else {
      fetchUserData();
      fetchExpenses();
      fetchSummary();
    }
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const finalDescription =
      description === "Other" ? customDescription : description;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': getToken()
      }
    };

    const newExpense = {
      category,
      description: finalDescription,
      amount: Number(amount),
      date
    };

    await axios.post('http://localhost:5000/api/expenses', newExpense, config);

    fetchExpenses();
    fetchSummary();

    setCategory('');
    setDescription('');
    setCustomDescription('');
    setAmount('');
    setDate('');
  };
  const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const totalThisMonth = expenses
  .filter(exp => {
    const expenseDate = new Date(exp.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  })
  .reduce((acc, exp) => acc + Number(exp.amount), 0);

const remainingBalance = monthlyTarget - totalThisMonth;


  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>{userName ? `Welcome, ${userName}!` : 'Dashboard'}</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      {/* Summary Section */}
      <div className="summary-cards">
        <div className="card">
          <h4>Total This Month</h4>
          <p>
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR'
            }).format(summary.totalAmount)}
          </p>
        </div>

      <div className="card">
  <h4>Set Monthly Budget</h4>
  <input
    type="number"
    placeholder="Enter Monthly Target"
    value={monthlyTarget}
    onChange={(e) => setMonthlyTarget(Number(e.target.value))}
  />
</div>
<div className="summary-cards">

  <div className="card">
    <h4>Monthly Target</h4>
    <p>
      {new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(monthlyTarget)}
    </p>
  </div>

  <div className="card">
    <h4>Spent This Month</h4>
    <p>
      {new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(totalThisMonth)}
    </p>
  </div>

  <div className="card">
    <h4>Remaining Balance </h4>
    <p style={{ color: remainingBalance < 0 ? 'red' : 'green' }}>
      {new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(remainingBalance)}
    </p>
  </div>

</div>


        <div className="card">
          <h4>Transactions</h4>
          <p>{summary.numberOfExpenses}</p>
        </div>
      </div>

      {/* Add Expense */}
      <h3>Add New Expense</h3>
      <form onSubmit={onSubmit}>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setDescription('');
            setCustomDescription('');
          }}
          required
        >
          <option value="">Select Category</option>
          {Object.keys(categoryOptions).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Description Dropdown */}
        {category && (
          <select
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          >
            <option value="">Select Description</option>
            {categoryOptions[category].map((desc) => (
              <option key={desc} value={desc}>{desc}</option>
            ))}
          </select>
        )}

        {/* Custom Description */}
        {description === "Other" && (
  <input
    type="text"
    placeholder="Enter description"
    value={customDescription}
    onChange={(e) => setCustomDescription(e.target.value)}
    required
  />
)}


        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit" className="btn btn-primary">
          Add Expense
        </button>
      </form>

      {/* Expense List */}
      <h3>Your Expenses</h3>
      {expenses.length > 0 ? (
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id}>
              <div className="expense-info">
                <strong>{expense.description}</strong>
                <small>{new Date(expense.date).toLocaleDateString()}</small>
                <span className="category-badge">{expense.category}</span>
              </div>

              <span className="expense-amount">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                }).format(Number(expense.amount))}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          You have no expenses yet.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
