import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import Navbar from './components/Navbar';
import MyRegistrations from './components/MyRegistrations';
import PrivateRoute from './components/PrivateRoute';
//import EditEventPage from './components/EditEventPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<EventForm />} />
          <Route path="/" element={<EventList />} />
          <Route path="/create-event" element={<PrivateRoute><EventForm /></PrivateRoute>} />
          <Route path="/my-registrations" element={<PrivateRoute><MyRegistrations /></PrivateRoute>}/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
