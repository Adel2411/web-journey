import "../styles/Motivation.css";
import { useState } from "react";

function Motivation() {
  const [likes, setLikes] = useState(0);
  const [animate, setAnimate] = useState(false);

  const likesCounter = () => {
  setLikes((likes) => {
    return likes + 1;
  });
   setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
}
   
  return (
    <div className="motivation">
      <h3>❤️ Motivation</h3>
      <button
        onClick={likesCounter}
        className={`like-btn ${animate ? "pulse" : ""}`}
        
      >
        Like
      </button>
      <p>{likes} {likes === 1 ? "like" : "likes"}</p>
    </div>
  );
}

export default Motivation;
