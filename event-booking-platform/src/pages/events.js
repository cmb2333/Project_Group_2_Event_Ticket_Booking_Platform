import React, { useEffect, useState } from "react";
import Card from "../components/card";
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
  }

  return (
    <div className="event-page">
      <h1>Events</h1>
      {console.log(events)}
      <ul>
      {events.map(event => {
        return (
          <Card event={event}/>
        )
      })}
      </ul>
    </div>
  );
};

export default Events;