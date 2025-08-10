import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container } from 'react-bootstrap';

const API_BASE_URL = 'https://campusconnect-xob1.onrender.com';

const MyRegistrations = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
    return `${date.toLocaleDateString('en-US', optionsDate)}, ${date.toLocaleTimeString('en-US', optionsTime)}`;
  };

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(API_BASE_URL + '/my-registrations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching registered events:', err);
        setError('Failed to load your registered events.');
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-3">My Registered Events</h2>
      {error && <p className="text-danger">{error}</p>}
      {events.length === 0 ? (
        <p>You haven't registered for any events yet.</p>
      ) : (
        
        events.map((event) => {
          if (!event) {
            return (
              <Card key={Math.random()} className="mb-4 border-danger">
                <Card.Body>
                  <Card.Title>Event no longer exists</Card.Title>
                  <Card.Text>This event has been removed by the organizer.</Card.Text>
                </Card.Body>
              </Card>
            );
          }

          return (
            <Card key={event._id} className="mb-4">
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <Card.Text><strong>Location:</strong> {event.location}</Card.Text>
                <Card.Text>
                  <strong>Date:</strong> {formatDateTime(event.date)}
                </Card.Text>
              </Card.Body>
            </Card>
          );
        })
      )}
    </Container>
  );
};

export default MyRegistrations;
