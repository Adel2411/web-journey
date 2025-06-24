import { useEffect, useState } from "react";
import "../styles/Timer.css";

function Timer() {
  const [minutes,setminutes] = useState(25);
  const [seconds,setseconds] = useState(0);
  const [message,setmessage] = useState('');
  const [running,isrunning] = useState(true);

  useEffect(() => {
    let timer;

    if (running){
      timer = setInterval(() => {
        if (minutes > 0){
          setminutes(minutes-1);
          setseconds(59);
        }else if(seconds > 0){
          setseconds(seconds-1);
        }else{
          clearInterval(timer);
          isrunning(false);
          setmessage("Session completed!");
        }
      },1000);
    }
  },[minutes,seconds,running]);
  return(
    <div className="timer">
      <h2>{minutes}:{seconds< 10 ?'0${seconds}' : seconds}</h2>
      <p>{message}</p>
    </div>

  )
}

export default Timer;
