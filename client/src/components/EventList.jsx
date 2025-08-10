import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Form, Alert } from 'react-bootstrap';
import getUserIdFromToken from '../utils/auth';
import EventEditForm from './EventEditForm';

const API_BASE_URL = 'https://campusconnect-xob1.onrender.com';

const EventList = () => {
  // State for events, alerts, and edit mode
  const [events, setEvents] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [myRegistrations, setMyRegistrations] = useState([]);
  const userId = getUserIdFromToken();

  useEffect(() => {
    fetchEvents();
    fetchMyRegistrations();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(API_BASE_URL+"/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const sortedEvents = res.data.sort(
        (b, a) => new Date(b.date) - new Date(a.date)
      );
      setEvents(sortedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events.');
    }
  };

  const fetchMyRegistrations = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(API_BASE_URL+'/my-registrations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const registeredEventIds = res.data.map(event => event._id);
      setMyRegistrations(registeredEventIds);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  const showAlert = (type, message) => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  };

  const handleDelete = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL+"/events"}/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e._id !== eventId));
      showAlert('success', 'Event deleted successfully!');
    } catch (err) {
      showAlert('error', 'Delete failed.');
      console.error(err);
    }
  };

  const handleRegister = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_BASE_URL}/register/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showAlert('success', 'You have registered successfully!');
      // Update the local state to change the button to "Registered"
      setMyRegistrations([...myRegistrations, eventId]);
    } catch (err) {
      // Check for the specific duplicate registration error message from the backend
      if (err.response?.status === 400 && err.response?.data?.message === 'Already registered for this event') {
        showAlert('warning', 'You are already registered for this event.');
      } else {
        showAlert('error', 'Registration failed: ' + (err.response?.data?.message || err.message));
      }
      console.error(err);
    }
  };

  const handleUpdateSuccess = (updatedEvent) => {
    setEvents(events.map((e) => (e._id === updatedEvent._id ? updatedEvent : e)));
    setEditingEvent(null);
    showAlert('success', 'Event updated successfully!');
  };

  // Filters events based on the search term
  const filteredEvents = events.filter((event) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = event.title.toLowerCase().includes(term);
    const dateMatch = new Date(event.date)
      .toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      .toLowerCase()
      .includes(term);
    return titleMatch || dateMatch;
  });

  // show the edit form if an event is being edited
  if (editingEvent) {
    return (
      <Container className="mt-4">
        <EventEditForm
          event={editingEvent}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={() => setEditingEvent(null)}
          showAlert={showAlert}
        />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-3">All Events</h2>
      {/* Alert components to display messages */}
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {/* Search bar for filtering events */}
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by title or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>
      {/* Map through the filtered events to display each one */}
      {filteredEvents.map((event) => {
        const creatorId = event.creator && (event.creator._id || event.creator);
        const isCreator = creatorId === userId;
        const isRegistered = myRegistrations.includes(event._id);
        const imageUrl = event.imageUrl || 'https://placehold.co/600x400/E5E7EB/9CA3AF?text=No+Image';

        return (
          <Card key={event._id} className="mb-4">
            <div className="d-flex align-items-center">
              {/* Event image */}
              <img
                src={imageUrl}
                alt="Event"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <Card.Text>
                  <strong>Location:</strong> {event.location}
                </Card.Text>
                <Card.Text>
                  <strong>Date:</strong>{' '}
                  {new Date(event.date).toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Card.Text>
                {/* Conditional rendering for the registration button */}
                {isRegistered ? (
                  <Button variant="success" disabled>
                    Registered 
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => handleRegister(event._id)}>
                    Register
                  </Button>
                )}
                {/* Conditional rendering for edit and delete buttons for event creators */}
                {isCreator && (
                  <>
                    <Button
                      variant="secondary"
                      className="ms-2"
                      onClick={() => setEditingEvent(event)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="ms-2"
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Card.Body>
            </div>
          </Card>
        );
      })}
    </Container>
  );
};

export default EventList;
