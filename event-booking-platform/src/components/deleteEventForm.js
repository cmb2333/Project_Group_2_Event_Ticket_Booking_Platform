const DeleteEventForm = ({ eventId, onEventDeleted }) => {
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await fetch(`http://localhost:3001/events/${eventId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    onEventDeleted(eventId);
                } else {
                    console.error('Failed to delete event');
                }
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    return <button className="delete-event-button" onClick={handleDelete}>Delete Event</button>;
};

export default DeleteEventForm;
