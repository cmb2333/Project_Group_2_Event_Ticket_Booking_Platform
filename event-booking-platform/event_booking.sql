-- event_booking.sql

-- Create the users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the events table
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC NOT NULL,
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create seats table
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    label VARCHAR(10) NOT NULL,
    category VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    event_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

INSERT INTO seats (label, category, price, status, event_id)
VALUES 
    ('A1', 'VIP', 100.00, 'available', 1),
    ('A2', 'VIP', 100.00, 'available', 1),
    ('A3', 'VIP', 100.00, 'booked', 1),
    ('B1', 'Regular', 50.00, 'available', 1),
    ('B2', 'Regular', 50.00, 'booked', 1),
    ('B3', 'Regular', 50.00, 'available', 1),
    ('C1', 'Balcony', 30.00, 'available', 1),
    ('C2', 'Balcony', 30.00, 'available', 1),
    ('C3', 'Balcony', 30.00, 'booked', 1);

ALTER TABLE users ADD COLUMN events INT[] DEFAULT '{}';


