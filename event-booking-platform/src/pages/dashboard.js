import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Card from "../components/card";
import "../App.css";

const Dashboard = () => {
    const { user } = useUser();
    const [bookedEvents, setBookedEvents] = useState([]);
    const [hostedEvents, setHostedEvents] = useState([]);

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

        const fetchHostedEvents = async () => {
            try {
                const response = await fetch(`http://localhost:3001/user/hosted-events/${user.user_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

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
                                <Card key={event.event_id} event={event} />
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


