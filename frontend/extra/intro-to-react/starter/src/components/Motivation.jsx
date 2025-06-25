import "../styles/Motivation.css";
import { useState } from "react";

function Motivation() {
  const [like, setLike] = useState(0)

  const handleLikes = () =>{
    if(like < 5) setLike((prev) => prev+1)
  }

  return (
    <div className="motivation">
      <button
        className={`motivation-btn level-${like}`}
        onClick={handleLikes}
        disabled={like === 5}
      >
        👍 Boost Motivation !
      </button>

      {like === 5 && <p className="motivation-msg">Nice focus. Keep it up! 🌟🚀</p>}
    </div>
  )
}

export default Motivation;
