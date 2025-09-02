import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState({ totalAmount: 0, numberOfExpenses: 0 });
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getToken = () => localStorage.getItem('token');
  
  const fetchUserData = async () => {
    try {
      const config = { headers: { 'x-auth-token': getToken() } };
      const res = await axios.get('http://localhost:5000/api/auth', config);
      setUserName(res.data.name);
    } catch (err) {
      console.error('Error fetching user data:', err.response ? err.response.data : err.message);
    }
  };

  const fetchSummary = async () => {
    try {
      const config = { headers: { 'x-auth-token': getToken() } };
      const res = await axios.get('http://localhost:5000/api/expenses/summary', config);
      setSummary(res.data);
    } catch (err) {
      console.error('Error fetching summary:', err.response ? err.response.data : err.message);
    }
  };

  const fetchExpenses = async () => {
    try {
      const config = { headers: { 'x-auth-token': getToken() } };
      const res = await axios.get('http://localhost:5000/api/expenses', config);
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses:', err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
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
    try {
      const config = { 
        headers: { 
          'Content-Type': 'application/json', 
          'x-auth-token': getToken() 
        } 
      };
      const newExpense = { description, amount, date };
      await axios.post('http://localhost:5000/api/expenses', newExpense, config);
      
      // Refresh data after adding a new expense
      fetchExpenses();
      fetchSummary();

      // Clear the form fields
      setDescription('');
      setAmount('');
      setDate('');
    } catch (err) {
      console.error('Error adding expense:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h2>{userName ? `Welcome, ${userName}!` : 'Dashboard'}</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
      
      <div className="summary-cards">
        <div className="card">
          <h4>Total This Month</h4>
          <p><span>$</span>{summary.totalAmount.toFixed(2)}</p>
        </div>
        <div className="card">
          <h4>Transactions</h4>
          <p>{summary.numberOfExpenses}</p>
        </div>
      </div>

      <h3>Add New Expense</h3>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button type="submit" className="btn btn-primary">Add Expense</button>
      </form>
      
      <h3>Your Expenses</h3>
      {expenses.length > 0 ? (
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id}>
              <div className="expense-info">
                <strong>{expense.description}</strong>
                <small>
                  {new Date(expense.date).toLocaleDateString()}
                </small>
              </div>
              <span className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>You have no expenses yet.</p>
      )}
    </div>
  );
};

export default Dashboard;