import "./App.css";
import Timer from "./components/Timer";
import NotesList from "./components/NotesList";
import Motivation from "./components/Motivation";
import { useState } from "react";

function App() {

  const [showNotesForm, setShowNotesForm] = useState(false);


  return (
    <div className="app-container">

      <Timer setShowNotesForm={setShowNotesForm} />

      <NotesList 
        showNotesForm={showNotesForm}
        setShowNotesForm={setShowNotesForm}
      />

      <Motivation />
    </div>
  );
}

export default App;
