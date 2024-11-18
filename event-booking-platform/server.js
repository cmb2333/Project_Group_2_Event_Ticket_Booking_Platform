require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/db');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Add user
app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
  
    // Validate input - for debugging
    if (!name || !email || !password) {
      return res.status(400).send('All fields are required');
    }
  
    try {
      const newUser = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password]
      );
  
      res.status(201).json(newUser.rows[0]);
    } catch (err) {
      console.error('Error inserting user:', err);
      res.status(500).send('Server error');
    }
  });

// Add event
app.post('/events', async (req, res) => {
  const { title, description, date, time, venue, category, price, created_by } = req.body;

  try {
    const newEvent = await pool.query(
      'INSERT INTO events (title, description, date, time, venue, category, price, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, date, time, venue, category, price, created_by]
    );

    res.status(201).json(newEvent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
