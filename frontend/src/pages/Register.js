import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      alert('Registration failed. User may already exist.');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Register</h2>
      <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Name" required />
      <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={onChange} placeholder="Password" required minLength="6" />
      <button type="submit">Register</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
};

export default Register;