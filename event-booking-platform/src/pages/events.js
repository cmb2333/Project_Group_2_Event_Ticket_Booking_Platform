import React, { useEffect, useState } from "react";
import Card from "../components/card";
import { Link } from "react-router-dom";
import "../App.css";

const Events = () => {
  const [events, setEvents] = useState([]);

  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3001/get-events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        const fetchedEvents = await response.json();
        setEvents(fetchedEvents.events);
      }
    } catch (error) {
      console.error(`Error getting events: ${error}`);
    }
  };

  return (
    <div className="event-page">
      <h1>Events</h1>
      <Link to={`/event-form`} className="create-event-button">
                Create Event
      </Link>
      <div className="event-list">
        {events.map(event => {
          return (
            <div key={event.event_id} className="event-item">
              <Card event={event} />
              {/* Button to navigate to seating chart */}
              <Link to={`/seating-chart/${event.event_id}`} className="seating-chart-button">
                View Seating Chart
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Events;
