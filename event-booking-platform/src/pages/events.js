import React, { useEffect, useState } from "react";
import Card from "../components/card";
import { Link } from "react-router-dom";
import "../App.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchVal, setSearchVal] = useState("");

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

  const handleSearch = async (e) => {
    e.preventDefault();
    let response;
    try {
      if (searchVal !== "") {
        response = await fetch(`http://localhost:3001/events/${searchVal}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });
      } else {
        response = await fetch("http://localhost:3001/get-events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });
      } 

      if (response.ok) {
        const fetchedEvents = await response.json();
        setEvents(fetchedEvents.events);
      }
    } catch (error) {
      console.error(`Error getting events: ${error}`)
    }
  };

  return (
    <div className="event-page">
      <h1>Events</h1>
        <form onSubmit={(e) => handleSearch(e)}>
          <div className="search-box">
            <label htmlFor="searchBox">
              Category:
            </label> 
            <input
              name="searchBox"
              className="inputBox"
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button type="submit">Search</button>
          </div>
        </form>
      {events.length === 0 ? (
        <p>No Events</p>
      ) : (
      <ul>
        {events.map(event => {
          return (
            <li key={event.event_id} className="event-item">
              <Card event={event} />
              {/* Button to navigate to seating chart */}
              <Link to={`/seating-chart/${event.event_id}`} className="seating-chart-button">
                View Seating Chart
              </Link>
            </li>
          );
        })}
      </ul>)}
    </div>
  );
};

export default Events;
