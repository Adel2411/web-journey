import React, { useState } from 'react';
import '../styles/NotesList.css';

const NotesList = ({ onAddNote, notes }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAddNote(text);
      setText('');
    }
  };

  return (
    <div className="notes-container">
      <h3>📝 What did you focus on ?</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Exemple : Study, Work, Reading Books..."
      />
      <button onClick={handleSubmit}>Add note</button>

      {notes.length > 0 && (
        <div className="notes-list">
          <h4>🗒️ Previous Notes</h4>
          <ul>
            {notes.map((note, index) => (
              <li key={index} className="note-card">
                <span className="note-index">#{index + 1}</span>
                <p className="note-text">{note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotesList;
