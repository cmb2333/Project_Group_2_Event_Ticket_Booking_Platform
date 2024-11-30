import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ConfirmationPage = () => {
    const { state } = useLocation();
    const { selectedSeats, eventId, eventTitle } = state || {};
    const { user } = useUser();
    const navigate = useNavigate();

    const handleConfirmBooking = async () => {
        try {
            const response = await fetch('http://localhost:3001/book-seats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.user_id,
                    eventId,
                    seats: selectedSeats.map((seat) => seat.id),
                }),
            });

            if (response.ok) {
                // Redirect to dashboard once confirmed
                alert('Booking confirmed!');
                navigate('/dashboard'); 
            } else {
                console.error('Failed to confirm booking:', await response.text());
            }
        } catch (error) {
            console.error('Error during booking confirmation:', error);
        }
    };

    if (!selectedSeats || selectedSeats.length === 0) {
        return <p>No seats selected.</p>;
    }

    return (
        <div>
            <h1>Booking Confirmation for {eventTitle}</h1>
            <ul>
                {selectedSeats.map((seat) => (
                    <li key={seat.id}>
                        {seat.label} - ${seat.price}
                    </li>
                ))}
            </ul>
            <p>Total: ${selectedSeats.reduce((sum, seat) => sum + parseFloat(seat.price || 0), 0).toFixed(2)}</p>
            <button onClick={handleConfirmBooking}>Confirm Booking</button>
        </div>
    );
};

export default ConfirmationPage;
