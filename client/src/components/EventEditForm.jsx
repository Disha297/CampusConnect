import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const EventEditForm = ({ event, onUpdateSuccess, onCancel, showAlert }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        location: event.location,
        date: event.date.split('T')[0],
        imageUrl: event.imageUrl || '',
      });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const updatedEvent = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };
      console.log('Sending to backend:', updatedEvent); 
      const res = await axios.put(
        `http://localhost:5000/api/events/${event._id}`,
        updatedEvent,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdateSuccess(res.data);
    } catch (err) {
      console.error('Update failed:', err);
      showAlert('error', 'Failed to update event.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Edit Event</h2>
      <Form onSubmit={handleUpdate}>
        <Form.Group controlId="formEventTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEventDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEventLocation" className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEventDate" className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        {/* ADDED: Form field for the image URL */}
        <Form.Group controlId="formEventImageUrl" className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
          />
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Update
        </Button>
        <Button variant="secondary" onClick={onCancel} className="ms-2">
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default EventEditForm;
