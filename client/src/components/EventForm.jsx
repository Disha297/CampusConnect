import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = '';

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState(''); 
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(API_BASE_URL +'/events', {
        title,
        description,
        date,
        location,
        imageUrl 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 201) {
        setSuccess('Event created successfully!');
        setError('');
        // Reset form
        setTitle('');
        setDescription('');
        setDate('');
        setLocation('');
        setImageUrl(''); 

        // redirect after 1.5s
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to create event');
      setSuccess('');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Create Event</h2>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="p-4 rounded-3 shadow-sm">
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-pill"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-pill"
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-4">
          <Form.Label>Image URL (Optional)</Form.Label>
          <Form.Control
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="rounded-pill"
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" className="w-100 fw-bold">
          Create Event
        </Button>
      </Form>
    </Container>
  );
};

export default EventForm;
