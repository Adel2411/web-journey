import "../styles/Timer.css";
import { useEffect, useState } from "react";

function Timer() {
  const originalSessionDuration = 1500;
  const [timeCount, setTimeCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(originalSessionDuration);
  const [userInput, setUserInput] = useState(""); // stores raw input
  const [error, setError] = useState(""); // stores error message

  const minutes = Math.floor(timeCount / 60);
  const seconds = timeCount % 60;

  const counter = () => {
    setTimeCount(timeCount => {
      const newTimeCount = timeCount + 1;

      if (newTimeCount === sessionDuration) {
        setSessionCount(sessionCount => sessionCount + 1);
        return 0;
      }

      return newTimeCount;
    });
  };

  // triggered when user clicks "Update"
  const confirmSessionDuration = () => {
    const numericValue = Number(userInput);

    if (
      userInput === "" ||
      isNaN(numericValue) ||
      numericValue <= 0 ||
      !Number.isInteger(numericValue)
    ) {
      setError("Please enter a valid positive whole number.");
      return;
    }

    // if valid input:
    setSessionDuration(numericValue);
    setTimeCount(0); // reset timer
    setError(""); // clear error
  };

  useEffect(() => {
    const interval = setInterval(counter, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer">
      <div>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div>Session count: {sessionCount}</div>

      <div>
        <input
          type="number"
          placeholder="Enter session duration in seconds"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
        />
        <button onClick={confirmSessionDuration}>Update</button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default Timer;
