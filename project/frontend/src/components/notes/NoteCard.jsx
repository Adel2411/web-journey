import React from 'react';
import './NoteCard.css';

export default function NoteCard({ note, onClose }) {
  return (
    <div className="noteard-detail">
      <button className="close-button" onClick={onClose}>← Back to list</button>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <div className="note-meta">
        <span>{note.authorName}</span>
        <span>{new Date(note.createdAt).toLocaleString()}</span>
      </div>
      <span className={note.isPublic ? 'public' : 'private'}>
        {note.isPublic ? 'Public' : 'Private'}
      </span>
    </div>
  );
}