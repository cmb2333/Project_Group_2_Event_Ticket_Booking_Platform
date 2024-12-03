import React, { useState } from "react";

const Card = (props) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };

  return (
    <div className={`event-card${open ? '-open' : ''}`} onClick={toggle}>
      <div className="event-card-title">Title: {props.event.title}</div>
      <div className="event-card-category">Category: {props.event.category}</div>
      <div className="event-card-venue">Venue: {props.event.venue}</div>
      {open && (
        <div className="event-card-details">
        <p>Price: ${props.event.price}</p>
        <p>Date: {props.event.date}</p>
        <p>Time: {props.event.time}</p>
        <p>Description: {props.event.description}</p>
      </div>
    )}
    </div>
  );
};

export default Card

