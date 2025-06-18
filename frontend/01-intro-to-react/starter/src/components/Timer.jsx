import "../styles/Timer.css";
import { useEffect, useState , useRef} from "react";

function Timer() {
  // 25 min session duration
  const originalSessionDuration = 1500;
  // timer
  const [timeCount, setTimeCount] = useState(0);
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

  const minutes = Math.floor(timeCount / 60);
  const seconds = timeCount % 60;

  // timer logic function
  const counter = () => {

    setTimeCount(timeCount => {

      const newTimeCount = timeCount + 1;
      if (newTimeCount === sessionDuration) {

          setSessionCount(sessionCount => {

          const newSessionCount = sessionCount + 1;
          setCongratsMessage(`GG you completed ${newSessionCount} session`);
          return newSessionCount;
          
          });
        
        return 0;
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

    // valid duration here
    setSessionDuration(numericValue);
    setTimeCount(0); 
    setSessionCount(0);
    setErrorMessage("");
    setCongratsMessage(""); 
  };

  useEffect(() => {
    const interval = setInterval(counter, 1000);
    return () => clearInterval(interval);
  }, [sessionDuration]);

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
      {congratsMessage && <div>{congratsMessage}</div>}
    </div>
  );
}

export default Timer;
