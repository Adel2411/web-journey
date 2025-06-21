import "../styles/Timer.css";
import { useState, useEffect } from "react";
import NotesList from "./NotesList";

const MESSAGES = [
  "Great  job !",
  "Awesome focus !",
  "You're doing amazing !",
  "Another one done !",
  "Well done, keep going !",
  "Proud of your effort !",
  "You've crushing it !",
];

function Timer({ onSessionEnd }) {
  const sessionDuration = 25 * 60; //rendre les minutes en secondes (25min)
  const [timeLeft, setTimeLeft] = useState(sessionDuration);
  const [sessionsCompleted, setSessionCompleted] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [randomMessage, setRandomMessage] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0 ) { // end of a session
          setSessionCompleted((prev) => prev + 1);
          setRandomMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
          setShowMessage(true);
          onSessionEnd?.(); //declencher le formulaire
          setTimeout(() => { setShowMessage(false);}, 10000); // pour masqqquer le message apres 10s
          return sessionDuration;  // redémarrer à 25min
        }
        return prevTime - 1;
      });
    }, 1000); // every second
    return () => clearInterval(interval); // cleaning
  }, [] );
  //convertir en format MM:SS
  const minutes = Math.floor(timeLeft/60);
  const seconds = timeLeft % 60;
  return (
    <div className = "timer" >
      <h2>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </h2>
      <div>  
        {showMessage && (
          <div className="congratsM" >
            {randomMessage} <br />
            You’ve completed {sessionsCompleted} session{sessionsCompleted > 1 ? "s" : ""} ! 
          </div>
        )} 
      </div>
    </div>
  );
}

export default Timer;
