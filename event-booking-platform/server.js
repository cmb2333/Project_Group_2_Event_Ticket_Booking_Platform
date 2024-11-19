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

// User Sign up
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
  });

// User Log in 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists using email
    const result = await pool.query(
      'SELECT user_id, name, email, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  

    const { user_id, name, email: user_email, password: hashedPassword } = result.rows[0];

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
      
    // Send user details to frontend
    res.json({
      message: 'Login successful',
      user_id,
      name,
      user_email
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile 
app.put('/update-profile', async (req, res) => {
  const { user_id, name, user_email } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE user_id = $3 RETURNING user_id, name, email',
      [name, user_email, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user_id: result.rows[0].user_id,
      name: result.rows[0].name,
      user_email: result.rows[0].email,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Change password
app.put('/change-password', async (req, res) => {
  const { user_id, currentPassword, newPassword } = req.body;

  try {
    // Fetch the user's current hashed password from the database
    const result = await pool.query(
      'SELECT password FROM users WHERE user_id = $1',
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const hashedPassword = result.rows[0].password;

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // Hash the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await pool.query(
      'UPDATE users SET password = $1 WHERE user_id = $2',
      [newHashedPassword, user_id]
    );

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Failed to update password.' });
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
