import { useState } from "react";
import './note.css';


function Note({showNote}) {
       
        const[note,setNote] = useState("");
        const[noteList,setnoteList] = useState([]) ; 
      
      
        const savenote = () => {
            if(note.trim() !== ''){
                setnoteList([ ... noteList, note]);
                setNote("");
                
            }
        };
        let noteForm;
         if(showNote) {
             noteForm = (
            <div className="note-form">
                <p className="note-question">What did you focus on ?👀</p>
                        <input className="note-input"
                         type="text"
                         value={note}
                         onChange={(e) => setNote(e.target.value)}
                         placeholder="Type your Note here..."
                          />
                <button className="button-save"onClick={savenote}>Save</button>
                   </div>  );
         }
            return (
    <div className="note-container">
      {noteForm}

      {noteList.length > 0 && (
        <div className="note-list">
          <h4>Your Notes:</h4>
          <ul>
            {noteList.map((n, index) => (
              <li key={index}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default Note;

