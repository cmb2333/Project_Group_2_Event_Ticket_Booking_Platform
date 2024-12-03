require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./src/db');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Fetching all events
app.get('/get-events', async (req, res) => {
  try {
    // Get all events in the events table
    const { rows } = await pool.query('SELECT * FROM events');
    res.json({
      events: rows
    });
  } catch (error) {
    console.error('Error fetching events: ', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Filtering events
app.get('/get-events/:filters', async (req, res) => {
  const filters = JSON.parse(req.params.filters);
  console.log(filters);
  let category = filters.category;
  let venue = filters.venue;
  let price = filters.price;
  console.log(`Filters: ${category}, ${venue}, ${price}`);
  
  if (category === "") {
    category = null;
  }

  if (venue === "") {
    venue = null;
  }

  if (price === 0 || price === "") {
    price = null;
  }
  console.log(`Filters: ${category}, ${venue}, ${price}`);
  try {
    const { rows } = await pool.query(
      'SELECT * FROM events WHERE category = COALESCE($1, category) AND venue = COALESCE($2, venue) AND price = COALESCE($3, price)',
      [category, venue, price]
    );
    console.log(rows);
    res.json({
      events: rows
    });
  } catch (error) {
    console.error('Error filter events: ', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Fetch specific event by event_id
app.get('/events/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    // Get the event details for given event_id
    const { rows } = await pool.query(
      'SELECT event_id, title, description, date, time, venue FROM events WHERE event_id = $1',
      [eventId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new event
app.post('/create-event', async (req, res) => {
  const { title, description, date, time, venue, category, price, created_by } = req.body;

  try {
      // Check if all required fields are provided
      if (!title || !date || !time || !venue || !category || !price || !created_by) {
          return res.status(400).json({ message: 'All fields are required.' });
      }

      // Insert the event data into the database
      const result = await pool.query(
          `INSERT INTO events (title, description, date, time, venue, category, price, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [title, description, date, time, venue, category, price, created_by]
      );

      // Respond with the created event
      res.status(201).json({
          message: 'Event created successfully',
          event: result.rows[0]
      });
  } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Update an Event
app.put('/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { title, description, date, time, venue, category, price } = req.body;

  if (!title || !description || !date || !time || !venue || !category || price == null) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  try {
      const result = await pool.query(
          'UPDATE events SET title = $1, description = $2, date = $3, time = $4, venue = $5, category = $6, price = $7 WHERE event_id = $8 RETURNING *',
          [title, description, date, time, venue, category, price, eventId]
      );
      res.status(200).json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating event' });
  }
});

// Delete an Event
app.delete('/events/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
      const result = await pool.query(
          'DELETE FROM events WHERE event_id = $1 RETURNING *',
          [eventId]
      );
      if (result.rowCount === 0) {
          return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting event' });
  }
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

// Seating
app.get('/seats/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
      const seats = await pool.query(
          'SELECT id, label, category, price, status FROM seats WHERE event_id = $1',
          [eventId]
      );
      res.status(200).json(seats.rows);
  } catch (error) {
      console.error('Error fetching seats:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// book seats
app.post('/book-seats', async (req, res) => {
  const { userId, eventId, seats } = req.body;

  if (!userId || !eventId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
      // Update seat statuses to 'booked'
      const result = await pool.query(
          'UPDATE seats SET status = $1 WHERE id = ANY($2::int[]) AND event_id = $3 RETURNING id',
          ['booked', seats, eventId]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ message: 'No seats were updated. Please check the seat IDs and event ID.' });
      }

      // Add event to the user's events array
      await pool.query(
          'UPDATE users SET events = array_append(events, $1) WHERE user_id = $2',
          [eventId, userId]
      );

      res.status(200).json({ message: 'Seats booked successfully', updatedSeats: result.rows });
  } catch (error) {
      console.error('Error booking seats:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Events the user has booked
app.get('/user/booked-events/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
      // Get event IDs from user's events column
      const userResult = await pool.query('SELECT events FROM users WHERE user_id = $1', [userId]);

      if (userResult.rows.length === 0 || !userResult.rows[0].events.length) {
          return res.status(404).json({ message: 'No booked events found for this user.' });
      }

      const eventIds = userResult.rows[0].events;

      // Fetch event details
      const { rows } = await pool.query(
          'SELECT event_id, title, description, date, time, venue, category, price FROM events WHERE event_id = ANY($1::int[])',
          [eventIds]
      );

      res.json({ bookedEvents: rows });
  } catch (error) {
      console.error('Error fetching booked events:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Events the user is hosting
app.get('/user/hosted-events/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
      // Fetch events where the user is the creator
      const { rows } = await pool.query(
          'SELECT event_id, title, description, date, time, venue, category, price FROM events WHERE created_by = $1',
          [userId]
      );

      if (rows.length === 0) {
          return res.status(404).json({ message: 'No hosted events found for this user.' });
      }

      res.json({ hostedEvents: rows });
  } catch (error) {
      console.error('Error fetching hosted events:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
