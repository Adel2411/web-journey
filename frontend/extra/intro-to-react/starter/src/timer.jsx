import {useState, useEffect} from 'react';
import './timer.css';
function Timer({sessionEnd}) {
    const initialTime = 25 * 60;
    const [timeLeft, settimeLeft] = useState(initialTime);
    const[timeRunning,settimeRunning] = useState(true);
    const [sessionCount ,setsessionCount] = useState(0);
     useEffect(() => {
                    let timer;
                  if(timeRunning && timeLeft > 0) {
                    timer = setInterval(()  => {
                     settimeLeft((prev) => prev-1);},1000);
                    }
                  if(timeLeft === 0){
                    settimeRunning(false);
                    setsessionCount((prev) => prev + 1 );
                    alert("Congratulation! you have finished a session✨");
                  if(sessionEnd){ sessionEnd(); }
                  settimeLeft(initialTime);
                  settimeRunning(true);  }
                
                  
                   return () => clearInterval(timer);
                } , [timeRunning,timeLeft]);
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2,'0');
        const seconds = (timeLeft % 60).toString().padStart(2,'0');
    
        return (
        
        <div className="Timer-Container">
       <h3 className="session-count">session: {sessionCount}</h3>
        <h2 className="Timer-Display">{minutes}:{seconds}</h2>  
        <button className="Timer-Button" onClick={() => settimeRunning(! timeRunning)}>
            {timeRunning ? "Pausse" : "start"}
        </button>
        </div> );
         }
    export default Timer;