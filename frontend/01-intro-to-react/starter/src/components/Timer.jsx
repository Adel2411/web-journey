import "../styles/Timer.css";
import { useEffect, useState , useRef} from "react";

function Timer() {
  const originalSessionDuration = 1500;
  const [timeCount, setTimeCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(originalSessionDuration);
  const [userInput, setUserInput] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const sessionDurationRef = useRef(sessionDuration);
  const minutes = Math.floor(timeCount / 60);
  const seconds = timeCount % 60;


  // make sure session duration is always up to date
  useEffect(() => {
    sessionDurationRef.current = sessionDuration;
  }, [sessionDuration]);

  // timer logic function
  const counter = () => {
    setTimeCount(timeCount => {
      const newTimeCount = timeCount + 1;
      if (newTimeCount === sessionDurationRef.current) {
        setSessionCount(sessionCount => sessionCount + 1);
        return 0;
      }

      return newTimeCount;
    });
  };

  // allow update the session duration
  const updateSessionDuration = () => {
    const numericValue = Number(userInput);

    // check if user entered invalid duration
    if (isNaN(numericValue) ||numericValue <= 0 ||!Number.isInteger(numericValue)) {
      setErrorMessage("enter a correct duration");
      return;
    }

    // valid duration here
    setSessionDuration(numericValue);
    setTimeCount(0); 
    setSessionCount(0);
    setErrorMessage(""); 
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
        <button onClick={updateSessionDuration}>Update</button>
      </div>

      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
}

export default Timer;
