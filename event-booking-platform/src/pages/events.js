import React, { useEffect, useState } from "react";
import Card from "../components/card";
import { Link } from "react-router-dom";
import "../App.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [categoryVal, setCategoryVal] = useState("");
  const [venueVal, setVenueVal] = useState("");
  const [priceVal, setPriceVal] = useState("");

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
      if (true) {
        const filters = {
          category: categoryVal,
          venue: venueVal,
          price: priceVal
        };
        response = await fetch(`http://localhost:3001/get-events/${JSON.stringify(filters)}`, {
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
      <Link to={`/event-form`} className="create-event-button">
                Create Event
      </Link>
      <div className="event-list">
        <form onSubmit={(e) => handleSearch(e)}>
          <div className="search-box">
            <div className="search-box-row">
              <label htmlFor="categoryInput">
                Category:
              </label> 
              <input
                name="categoryInput"
                className="search-input"
                type="text"
                value={categoryVal}
                onChange={(e) => setCategoryVal(e.target.value)}
              />
            </div>
            <div className="search-box-row">
              <label htmlFor="venueInput">
                Venue:
              </label> 
              <input
                name="venueInput"
                className="search-input"
                type="text"
                value={venueVal}
                onChange={(e) => setVenueVal(e.target.value)}
              />
            </div>
            <div className="search-box-row">
              <label htmlFor="priceInput">
                Price:
              </label> 
              <input
                name="priceInput"
                className="search-input"
                type="number"
                min="0"
                value={priceVal}
                onChange={(e) => setPriceVal(e.target.value)}
              />
            </div>
            <button type="submit">Search</button>
          </div>
        </form>
      {events.length === 0 ? (
        <p>No Events</p>
      ) : (
      <ul>
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
      </ul>)}
      </div>
    </div>
  );
};

export default Events;
