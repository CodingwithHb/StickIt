import React, { useEffect, useState } from "react";
import axios from "axios";


function ShareNote({ noteId, onShareSuccess, onCancel }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const response = await axios.get("https://notes.devlop.tech/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const handleShareNote = async () => {
    if (!selectedUser) {
      setError("Please select a user to share the note.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      await axios.put(
        `https://notes.devlop.tech/api/notes/${noteId}/share`,
        { shared_with: [selectedUser] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onShareSuccess();
    } catch (err) {
      setError("Failed to share the note.");
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUser(userId);
    setShowOptions(false);
  };

  return (
    <div className="share-note">
      <h2>Share Note</h2>
      <div className="user-dropdown">
        <div
          className="dropdown-selected"
          onClick={() => setShowOptions(!showOptions)}
        >
          {selectedUser
            ? users.find((user) => user.id === selectedUser).first_name
            : "-- Select User --"}
        </div>
        {showOptions && (
          <div className="dropdown-options">
            {users.map((user) => (
              <div
                key={user.id}
                className="option"
                onClick={() => handleSelectUser(user.id)}
              >
                {`${user.first_name} ${user.last_name}`}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="actions">
        <button className="share-btn" onClick={handleShareNote}>
          Share
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ShareNote;
