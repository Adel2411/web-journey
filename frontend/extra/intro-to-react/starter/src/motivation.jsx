import { useState } from "react";
import './motivation.css';
function Motivation() {
    const [motivation , setMotivation]=useState(0);

   return (
   <div className="motivation-container">
    <button className="motivation-button"
               onClick={()=> {
                setMotivation( motivation+1);}}> Like 💗</button>
                
                    <p className="likes">Likes ❤ : {motivation}</p>
                </div>
    );
}
export default Motivation;