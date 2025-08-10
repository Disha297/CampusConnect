import { jwtDecode } from 'jwt-decode';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.userId;
  } catch (err) {
    console.error('Invalid token');
    return null;
  }
};

export default getUserIdFromToken;



