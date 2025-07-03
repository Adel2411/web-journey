import React from 'react';
import './NoteItem.css';

export default function NoteItem({ note, onClick }) {
  return (
    <div className="note-item" onClick={onClick}>
          <h2 className="note-title" >{note.title}</h2>
          <p className="note-content">
            {note.content.length > 100 ? note.content.slice(0, 100) + "..." : note.content}
            </p>
            <div className="note-metadata">
              <span>By {note.authorName} • {new Date(note.createdAt).toISOString().split('T')[0]}</span>
            </div>
            <span className={`note-tag ${note.isPublic ? 'note-public' : 'note-private'}`}>
              {note.isPublic ? "Public" : "Privé"}
            </span>
        </div>
  );
}