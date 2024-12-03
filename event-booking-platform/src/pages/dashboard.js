import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Card from "../components/card";
import "../App.css";
import EditEventForm from '../components/editEventForm';
import DeleteEventForm from '../components/deleteEventForm';

const Dashboard = () => {
  const { user } = useUser();
  const [bookedEvents, setBookedEvents] = useState([]);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null); // track which event is being edited

  useEffect(() => {
    const fetchBookedEvents = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/user/booked-events/${user.user_id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBookedEvents(data.bookedEvents);
        } else {
          console.error("Failed to fetch booked events:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching booked events:", error);
      }
    };

    const fetchHostedEvents = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/user/hosted-events/${user.user_id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setHostedEvents(data.hostedEvents);
        } else {
          console.error("Failed to fetch hosted events:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching hosted events:", error);
      }
    };

    if (user) {
      fetchBookedEvents();
      fetchHostedEvents();
    }
  }, [user]);

  const handleUpdateEventClick = (eventId) => {
    setEditingEventId(eventId); // Set the event ID to edit
  };

  const handleSaveEvent = (updatedEvent) => {
    setHostedEvents((prevHostedEvents) =>
      prevHostedEvents.map((event) =>
        event.event_id === updatedEvent.event_id ? updatedEvent : event
      )
    );
    setEditingEventId(null); // Exit edit mode
  };

  const onEventDeleted = (deletedEventId) => {
    setHostedEvents((prevHostedEvents) =>
      prevHostedEvents.filter((event) => event.event_id !== deletedEventId)
    );
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-panels">
        <div className="left-panel">
          <h2>Your Booked Events</h2>
          {bookedEvents.length > 0 ? (
            <ul className="events-list">
              {bookedEvents.map((event) => (
                <Card key={event.event_id} event={event} />
              ))}
            </ul>
          ) : (
            <p>You have not booked any events yet.</p>
          )}
        </div>

        <div className="right-panel">
          <h2>Your Hosted Events</h2>
          {hostedEvents.length > 0 ? (
            <ul className="events-list">
              {hostedEvents.map((event) => (
                <div key={event.event_id}>
                  {editingEventId === event.event_id ? (
                    <div className="edit-mode">
                        <EditEventForm
                        event={event}
                        onSave={(updatedEvent) => handleSaveEvent(updatedEvent)}
                        onCancel={() => setEditingEventId(null)}
                        />
                    </div>
                  ) : (
                    <>
                      <div className="display-mode">
                        <Card event={event} />
                        <button
                            className="update-event-button"
                            onClick={() => handleUpdateEventClick(event.event_id)}
                        >
                            Update Event
                        </button>
                        <DeleteEventForm
                            eventId={event.event_id}
                            onEventDeleted={onEventDeleted}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </ul>
          ) : (
            <p>You are not hosting any events yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



