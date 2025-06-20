import React, { useState } from "react";
import Timer from "./timer";
import Note from "./note";
import Motivation from "./motivation";
import './App.css';
 

function App() {
      const [endSession, setendSession] = useState(false);
        return (
            
               <div className="app-container">
                  <Motivation />
                <Timer sessionEnd={() => setendSession(true)} />
                <Note showNote={endSession}/>
              
              </div>
          );
 }

 export default App;

