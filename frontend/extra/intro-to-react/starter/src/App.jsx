import React, { useState } from 'react';
import Timer from './components/Timer';
import Motivation from './components/Motivation';
import NotesList from './components/NotesList';
import './App.css';

function App() {
  const [sessionCount, setSessionCount] = useState(0);
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);

  const handleSessionComplete = () => {
    setSessionCount(prev => prev + 1);
    setShowNotes(true);
  };

  const handleAddNote = (note) => {
    setNotes(prevNotes => [note, ...prevNotes]);
    setShowNotes(false);
  };

  const getCongratsMessage = () => {
    if (sessionCount === 0) {
      return "🎉 Welcome! Ready to start your first session?";
    } else {
      return `🎉 Great job! You've completed ${sessionCount} session${sessionCount !== 1 ? 's' : ''}!`;
    }
  };
  
  return (
    <div className="app-container">
      <h1>⏱️ Productivity Pulse</h1>

      <div className="congrats-msg">{getCongratsMessage()}</div>

      <Timer onSessionComplete={handleSessionComplete} />
      <Motivation sessionCount={sessionCount} />
      {showNotes && <NotesList onAddNote={handleAddNote} notes={notes} />}
    </div>
  );
}

export default App;
