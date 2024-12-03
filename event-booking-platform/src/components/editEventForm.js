import React, { useState } from 'react';

const EditEventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: event.title || '',
    description: event.description || '',
    date: event.date || '',
    time: event.time || '',
    venue: event.venue || '',
    category: event.category || '',
    price: event.price || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/events/${event.event_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        onSave(updatedEvent); // Pass the updated event back to the parent
      } else {
        console.error('Failed to update event:', await response.text());
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Event</h2>
      <label htmlFor="title">Event Title:</label>
      <input
        className='inputBox'
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <label htmlFor="description">Description:</label>
      <textarea
        className='inputBox'
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <label htmlFor="date">Date:</label>
      <input
        className='inputBox'
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      <label htmlFor="time">Time:</label>
      <input
        className='inputBox'
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
      />
      <label htmlFor="venue">Venue:</label>
      <input
        className='inputBox'
        type="text"
        name="venue"
        value={formData.venue}
        onChange={handleChange}
      />
      <label htmlFor="category">Category:</label>
      <input
        className='inputBox'
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
      />
      <label htmlFor="price">Price:</label>
      <input
        className='inputBox'
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
      />
      <div className="form-buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditEventForm;

