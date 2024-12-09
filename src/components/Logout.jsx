// components/Logout.jsx
import React from 'react';
import { useHistory } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    history.push('/login'); // Redirect to login page
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
