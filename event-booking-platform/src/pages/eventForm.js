import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from "react-router-dom";


const EventForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...formData,
        created_by: user.user_id
      };

      const response = await fetch('http://localhost:3001/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Event created successfully');
        setError('');
        navigate("/dashboard"); // Redirect to the dashboard
      } else {
        setError(data.message || 'An error occurred while creating the event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setError('An error occurred while creating the event');
    }
  };

  return (
    <div className="form-section">
    <div className='form-card'>
        <h2>Create a New Event</h2>
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="title">Event Title:</label>
            <input
            className='inputBox'
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label htmlFor="description">Description:</label>
            <textarea
            className='inputBox'
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label htmlFor="date">Date:</label>
            <input
            className='inputBox'
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label htmlFor="time">Time:</label>
            <input
            className='inputBox'
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label htmlFor="venue">Venue:</label>
            <input
            className='inputBox'
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label htmlFor="category">Category:</label>
            <input
            className='inputBox'
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label htmlFor="price">Price:</label>
            <input
            className='inputBox'
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            />
        </div>
        <button type="submit">Create Event</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
    </div>
  );
};

export default EventForm;



