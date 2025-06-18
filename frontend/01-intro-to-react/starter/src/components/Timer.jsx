import "../styles/Timer.css";
import { useEffect, useState } from "react";

function Timer({ addNote }) {
  // 25 min session duration
  const originalSessionDuration = 1500;
  // timer
  const [timeCount, setTimeCount] = useState(originalSessionDuration);
  // session counter
  const [sessionCount, setSessionCount] = useState(0);
  // session duration
  const [sessionDuration, setSessionDuration] = useState(originalSessionDuration);
  // user input for session duration
  const [userInput, setUserInput] = useState(""); 
  // error message incase user enters invalid duration
  const [errorMessage, setErrorMessage] = useState(""); 
  // congrats message
  const [congratsMessage, setCongratsMessage] = useState("");
  // note form
  const [showNoteForm, setShowNoteForm] = useState(false);
  // note input
  const [noteInput, setNoteInput] = useState("");
  // pause timer for writing and sending note 
  const [pause, setPause] = useState(false); 

  const minutes = Math.floor(timeCount / 60);
  const seconds = timeCount % 60;

  // timer logic function
  const counter = () => {

    setTimeCount(timeCount => {

      const newTimeCount = timeCount - 1;
      if (newTimeCount === 0) {

          setSessionCount(sessionCount => {

          const newSessionCount = sessionCount + 1;
          setCongratsMessage(`GG you completed ${newSessionCount} session`);
          return newSessionCount;
          });

        setShowNoteForm(true);
        setPause(true); 
        return sessionDuration;
      }

      return newTimeCount;
    });
  };

  // allow updating the session duration by user
  const updateSessionDuration = () => {

    const numericValue = Number(userInput);

    // check if user entered invalid duration
    if (isNaN(numericValue) ||numericValue <= 0 ||!Number.isInteger(numericValue)) {
      setErrorMessage("enter a correct duration");
      return;
    }

    // if duration is valid set session duration and timer to new duration and set session count to 0
    setSessionDuration(numericValue);
    setTimeCount(numericValue); 
    setSessionCount(0);
    // make sure only timer and input for duration gonne be visible and timer is running
    setErrorMessage("");
    setCongratsMessage(""); 
    setPause(false);
    setShowNoteForm(false);
  };

  // function for submitting note
  const noteSubmit = () => {
    addNote(noteInput); 
    setNoteInput("");
    setShowNoteForm(false);
    setPause(false); 
  };

  useEffect(() => {
    if (pause) return;
    const interval = setInterval(counter, 1000);
    return () => clearInterval(interval);
  }, [sessionDuration, pause]);

  return (
  <div className="timer">
    <div className="time-display">
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>

    <div className="session-info">Session count: {sessionCount}</div>

    <div className="input-controls">
      <input
        type="number"
        placeholder="Enter session duration in seconds"
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
      />
      <button onClick={updateSessionDuration}>Update</button>
    </div>

    {errorMessage && <div className="error-message">{errorMessage}</div>}
    {congratsMessage && <div className="congrats-message">{congratsMessage}</div>}
    {showNoteForm && (
        <div className="note-form">
          <textarea
            placeholder="What did you focus on?"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
          <button onClick={noteSubmit}>Save Note</button>
        </div>
    )}
  </div>
  
);
}

export default Timer;
