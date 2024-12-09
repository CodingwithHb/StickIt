import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateNote from "./UpdateNote";
import CreateNote from "./CreateNote";
import ChangePassword from "./ChangePassword";
import "../styles/List.scss";

function List({ onLogout,firstName }) {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [modalContent, setModalContent] = useState(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [showSharedNotes, setShowSharedNotes] = useState(false); // New state for toggle

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const response = await axios.get("https://notes.devlop.tech/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter notes based on the toggle state
        const filteredNotes = showSharedNotes
          ? response.data.filter((note) => note.shared_with && note.shared_with.length > 0)
          : response.data;

        setNotes(filteredNotes);
      } catch (err) {
        setError("Failed to fetch notes. Please log in again.");
        onLogout();
      }
    };

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

    if (!isLoggedOut) {
      fetchNotes();
      fetchUsers();
    }
  }, [isLoggedOut, showSharedNotes]); // Re-fetch notes when the toggle changes

  const handleNoteCreated = (newNote) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setModalContent(null);
  };

  const handleUpdateSuccess = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
    setModalContent(null);
  };

  const handleShareNote = async (noteId) => {
    const selectedUserId = selectedUsers[noteId];
    if (!selectedUserId) {
      setError("Please select a user to share with.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await axios.put(
        `https://notes.devlop.tech/api/notes/${noteId}`,
        { shared_with: [selectedUserId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, shared_with: response.data.shared_with } : note
        )
      );

      setSelectedUsers((prev) => ({ ...prev, [noteId]: "" }));
      setModalContent(null);
    } catch (err) {
      setError("Failed to share the note.");
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      await axios.delete(`https://notes.devlop.tech/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (err) {
      setError("Failed to delete the note.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedOut(true);
    onLogout();
  };
  
  const handleToggleChange = () => {
    setShowSharedNotes(!showSharedNotes);
  };

  const renderModalContent = () => {
    if (!modalContent) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-btn" onClick={() => setModalContent(null)}>
            ✖
          </button>
          {modalContent.type === "create" && (
            <CreateNote onNoteCreated={handleNoteCreated} onCancel={() => setModalContent(null)} />
          )}
          {modalContent.type === "update" && (
            <UpdateNote
              note={modalContent.note}
              onUpdateSuccess={handleUpdateSuccess}
              onCancel={() => setModalContent(null)}
            />
          )}
          {modalContent.type === "share" && (
            <div className="share-note-modal">
              <h3>Share Note ➤</h3>
              <label>Share With:</label>
              <select
                value={selectedUsers[modalContent.noteId] || ""}
                onChange={(e) =>
                  setSelectedUsers((prev) => ({
                    ...prev,
                    [modalContent.noteId]: e.target.value,
                  }))
                }
                 className="user-select"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {`${user.first_name} ${user.last_name}`}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleShareNote(modalContent.noteId)}
                className="share-btn "
              >
                Share
              </button>
              <button className="cancel" onClick={() => setModalContent(null)}>
                Cancel
              </button>
            </div>
          )}
          {modalContent.type === "password" && (
            <ChangePassword onPasswordChange={() => setModalContent(null)} onCancel={() => setModalContent(null)} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="list-container">
       <div className="name"> {firstName && <h2>Hello {firstName}!👋 </h2>}</div>
      <div className="header-actions">
      <div className="toggle-container">
          <label> shared notes only 📋</label>
          <div className="check">
            <input
              type="checkbox"
              checked={showSharedNotes}
              onChange={handleToggleChange}
            />
            <label></label>
          </div>
      </div>
        
        <button
          className="create-note-btn"
          onClick={() => setModalContent({ type: "create" })}
        ><abbr title="create new note">➕ Create Note</abbr>
          
        </button>
        <button
          className="change-password-btn"
          onClick={() => setModalContent({ type: "password" })}
        >
          <abbr title="change password">🔒 Change Password</abbr>
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <abbr title="Logout">🚪 Logout</abbr>
        </button>
        
      </div>

    
    

    
<hr />
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-card sticky-note">
            <hr />
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <hr /> 
            {note.shared_with && note.shared_with.length > 0 && (
              <p className="shared-with">
                Shared with:{" "}
                {note.shared_with
                  .map((user) => `${user.first_name} ${user.last_name}`)
                  .join(", ")}
              </p>
            )} 
            <div className="note-actions">
              <button
                onClick={() => setModalContent({ type: "update", note })}
                className="update-btn"
              >
                <abbr title="update note">✏️</abbr>
              </button>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="delete-btn"
              >
                <abbr title="delete note">✖</abbr>
              </button>
              <button
                onClick={() => setModalContent({ type: "share", noteId: note.id })}
                className="share-btn"
              >
                <abbr title="share note">➤</abbr>
                
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}

      {renderModalContent()}
    </div>
  );
}

export default List;
