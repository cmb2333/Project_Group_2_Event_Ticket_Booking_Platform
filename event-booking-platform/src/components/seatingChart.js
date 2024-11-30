import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../App.css';

// Access seat, event, and user
const SeatingChart = () => {
    const { eventId } = useParams();
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventTitle, setEventTitle] = useState('');
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSeatsAndEvent = async () => {
            try {
                const seatsResponse = await fetch(`http://localhost:3001/seats/${eventId}`);
                const eventResponse = await fetch(`http://localhost:3001/events/${eventId}`);
                if (seatsResponse.ok && eventResponse.ok) {
                    setSeats(await seatsResponse.json());
                    setEventTitle((await eventResponse.json()).title);
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeatsAndEvent();
    }, [eventId]);

    const handleSeatClick = (seat) => {
        if (seat.status === 'booked') return;

        const updatedSeats = seats.map((s) =>
            s.id === seat.id
                ? { ...s, status: s.status === 'selected' ? 'available' : 'selected' }
                : s
        );
        setSeats(updatedSeats);

        if (seat.status === 'selected') {
            setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
        } else {
            setSelectedSeats((prev) => [...prev, seat]);
        }
    };

    // Redirect to login if not authenticated
    const handleCheckout = () => {
        if (!user) {
            navigate('/signin'); 
        } else {
            navigate('/confirmation', { state: { selectedSeats, eventId, eventTitle } });
        }
    };

    if (loading) return <p>Loading seating chart...</p>;

    return (
        <div>
            <h1>Seating Chart for {eventTitle}</h1>
            <div className="seating-chart">
                {seats.map((seat) => (
                    <button
                        key={seat.id}
                        className={`seat ${seat.status}`}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === 'booked'}
                    >
                        {seat.label}
                    </button>
                ))}
            </div>
            <div className="selected-seats">
                <h3>Selected Seats:</h3>
                <ul>
                    {selectedSeats.map((seat) => (
                        <li key={seat.id}>
                            {seat.label} - ${seat.price}
                        </li>
                    ))}
                </ul>
                <p>Total: ${selectedSeats.reduce((sum, seat) => sum + parseFloat(seat.price || 0), 0).toFixed(2)}</p>
                {selectedSeats.length > 0 && (
                    <button className="checkout-button" onClick={handleCheckout}>
                        Checkout
                    </button>
                )}
            </div>
        </div>
    );
};

export default SeatingChart;



