// components/DeleteNote.jsx
import React from 'react';
import { handleApiRequest } from '../services/api';

const DeleteNote = ({ noteId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await handleApiRequest('delete', `https://notes.devlop.tech/api/notes/${noteId}`);
      onDelete(noteId); // Notify parent component to remove the note
    } catch (err) {
      alert('Error deleting note');
    }
  };

  return <button onClick={handleDelete}>Delete Note</button>;
};

export default DeleteNote;
