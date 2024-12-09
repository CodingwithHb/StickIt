import React, { useState } from "react";
import axios from "axios";
import "../styles/CreateNote.scss";

function CreateNote({ onNoteCreated, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const handleCreateNote = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await axios.post(
        "https://notes.devlop.tech/api/notes",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onNoteCreated(response.data);
      setTitle("");
      setContent("");
    } catch (err) {
      setError("Failed to create a new note.");
    }
  };

  return (
    <div className="create-note">
  <h2>Create New Note 📍</h2>
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
  <button className="create" onClick={handleCreateNote}>
    Create
  </button>
  <button className="cancel" onClick={onCancel}>
    Cancel
  </button>
  {error && <p className="error-message">{error}</p>}
</div>

  );
}

export default CreateNote;
