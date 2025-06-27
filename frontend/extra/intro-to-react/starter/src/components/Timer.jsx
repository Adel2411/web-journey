import "../styles/Timer.css";
import { useState, useEffect , useRef } from "react";



function Timer({ setShowNotesForm }) {

  const [timeLeft, setTimeLeft] = useState(5)
  const timerRef = useRef(null)
  const [sessionCont, setSessionCont] = useState(0)
  const [showMessage, setShowMessage]  = useState(false)


  const startTimer = () => {

    if (timerRef.current) return; 

    timerRef.current = setInterval(

    ()=> { setTimeLeft((currentTime) =>{
      
      if( currentTime === 0){

        clearInterval(timerRef.current)
        timerRef.current = null

        setSessionCont((session) => session +1)
        setShowMessage(true)
        setShowNotesForm(true)

        setTimeout(() => {

          setShowMessage(false)

        }, 4000)
        return 0;

      } else {

        return currentTime - 1;
      }
    }) } , 1000)
  }


  useEffect(() => {
    const timeout = setTimeout(() => {
      startTimer(); 
    }, 0);        // to avoid React strict mood

    return () => {
      //cleanup
      clearTimeout(timeout);
      clearInterval(timerRef.current);
      timerRef.current = null;      
               
    };
  }, []);



  const reset = () => {

    clearInterval(timerRef.current) // stop the previous timer
    timerRef.current = null;
    setTimeLeft(5)
    startTimer()
  }

  


  const minits = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return(
    <>
      <div className="timer">
      <h1>
        {String(minits).padStart(2, "0")} : {String(seconds).padStart(2, "0")}
      </h1>

      <p>
        Sessions Completed : {Math.floor(sessionCont / 2)} 
      </p>
    
      <button className="reset-button" onClick={reset}>
        reset
      </button>

    </div>

    
    {showMessage &&
       <div className="congrat-message">
          <p>
            🎉 Great job! You’ve completed {Math.floor( sessionCont / 2)} session!”
          </p>
        </div>
    }
    </>
  )

}

export default Timer;
