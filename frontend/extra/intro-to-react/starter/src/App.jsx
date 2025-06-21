import { useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import NotesList from "./components/NotesList";
import Motivation from "./components/Motivation";

function App() {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const handleSessionEnd = () => {
    setShowNoteForm(true);
    setTimeout(() => { setShowNoteForm(false);}, 10000); //cache le formulaire apres 10s
  };
  return (
    <div className="app-container">
      <h1 className="app-heading">Welcome MC team !</h1>

      <Timer onSessionEnd={handleSessionEnd} />
      <NotesList showForm={showNoteForm} />
      <Motivation />
    </div>
  );
}

export default App;
