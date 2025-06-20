import React, { useState } from 'react';
import '../styles/NotesList.css';

const NotesList = ({ onAddNote }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAddNote(text);
      setText('');
    }
  };

  return (
    <div className="notes-container">
      <h3>📝 Sur quoi t'es-tu concentré ?</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Exemple : Création du composant Timer, correction CSS, révision des hooks..."
      />
      <button onClick={handleSubmit}>Ajouter la note</button>
    </div>
  );
};

export default NotesList;
