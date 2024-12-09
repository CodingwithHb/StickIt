import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ChangePassword.scss';

function ChangePassword({ onPasswordChanged, onCancel }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setMessage('');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing.');

      await axios.put(
        'https://notes.devlop.tech/api/update-password',
        {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowPopup(true);
      setFormVisible(false);
      onPasswordChanged?.();

      setTimeout(() => {
        setShowPopup(false);
      }, 5000);

      resetForm();
    } catch (err) {
      setError('Failed to update password. Please try again.');
      setMessage('');
    }
  };

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="change-password">
      {showPopup && (
        <div className="popup">
          <p>Password changed successfully!</p>
        </div>
      )}

      {formVisible && (
        <form onSubmit={handleSubmit}>
          <h2>Change Password 🔒</h2>
          <div>
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <div>
            <button type="submit" className="update">
              Update Password
            </button>
            <button type="button" onClick={() => onCancel?.()} className="cancel">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ChangePassword;
