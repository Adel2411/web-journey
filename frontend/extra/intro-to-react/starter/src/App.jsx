import React, { useState } from 'react';
import Timer from './components/Timer';
import NotesList from './components/NotesList';
import Motivation from './components/Motivation';
import './App.css';

const App = () => {
  const [sessionCount, setSessionCount] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState([]);

  const handleSessionComplete = () => {
    const newCount = sessionCount + 1;
    setSessionCount(newCount);
    setShowCongrats(true);
    setShowNotes(true);

    setTimeout(() => setShowCongrats(false), 4000); // cache après 4 sec
  };

  const handleAddNote = (noteText) => {
    if (noteText.trim()) {
      setNotes([...notes, noteText]);
      setShowNotes(false); // cacher après soumission
    }
  };

  return (
    <div className="app">
      <h1>🧠 Productivity Pulse</h1>

      {showCongrats && (
        <div className="congrats">
          🎉 Bravo ! Tu as terminé {sessionCount} session{sessionCount > 1 ? 's' : ''} !
        </div>
      )}

      <Timer onSessionComplete={handleSessionComplete} />

      {showNotes && (
        <NotesList onAddNote={handleAddNote} />
      )}

      {notes.length > 0 && (
        <div className="previous-notes">
          <h3>📝 Notes précédentes</h3>
          <ul>
            {notes.map((n, i) => <li key={i}>• {n}</li>)}
          </ul>
        </div>
      )}

      <Motivation />
    </div>
  );
};

export default App;



