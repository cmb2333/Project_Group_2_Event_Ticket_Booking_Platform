const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

// Test the connection on initialization
(async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Test Query Result:', result.rows);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
})();

// Fetch all seats for a specific event
async function fetchSeats(eventId) {
    try {
        const result = await pool.query(
            'SELECT id, label, category, price, status FROM seats WHERE event_id = $1 ORDER BY label',
            [eventId]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching seats:', error);
        throw error;
    }
}

// Update status of a seat (for booking)
async function updateSeatStatus(seatId, status) {
    try {
        const result = await pool.query(
            'UPDATE seats SET status = $1 WHERE id = $2 RETURNING *',
            [status, seatId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating seat status:', error);
        throw error;
    }
}

module.exports = {
    pool,
    fetchSeats,
    updateSeatStatus,
};

