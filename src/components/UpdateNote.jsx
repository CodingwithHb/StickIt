import React, { useState } from "react";
import axios from "axios";
import "../styles/UpdateNote.scss"

function UpdateNote({ note, onUpdateSuccess, onCancel }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [error, setError] = useState(null);

  const handleUpdateNote = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await axios.put(
        `https://notes.devlop.tech/api/notes/${note.id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdateSuccess(response.data);
    } catch (err) {
      setError("Failed to update the note.");
    }
  };

  return (
    <div className="update-note">
      <h2>Update Note ✏️</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button
        onClick={handleUpdateNote}
        className="create"
      >
        Update
      </button>
      <button
        onClick={onCancel}
        className="cancel"
      >
        Cancel
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default UpdateNote;
