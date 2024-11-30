import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Card from "../components/card";
import "../App.css";

// Access the user and events
const Dashboard = () => {
    const { user } = useUser();
    const [bookedEvents, setBookedEvents] = useState([]);

    useEffect(() => {
        const fetchBookedEvents = async () => {
            try {
                const response = await fetch(`http://localhost:3001/user/booked-events/${user.user_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

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

        if (user) {
            fetchBookedEvents();
        }
    }, [user]);

    return (
        <div className="dashboard-page">
            <h1>Your Booked Events</h1>
            {bookedEvents.length > 0 ? (
                <ul className="events-list">
                    {bookedEvents.map((event) => (
                        <Card key={event.event_id} event={event} />
                    ))}
                </ul>
            ) : (
                <p>You have not booked any events yet</p>
            )}
        </div>
    );
};

export default Dashboard;

