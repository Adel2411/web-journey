import { use } from "react";
import "../styles/Motivation.css";
import { useState } from "react";
import clickSound from "../assets/click-sound.wav";

function Motivation() {
  const [likes, setLikes] = useState(0);
  const handleLike = () => {
    const audio = new Audio(clickSound);
    audio.play();
    setLikes(likes + 1);
  };
  return (
    <div className="motiv-container">
      <button className="like-button" onClick={handleLike}>Likes: {likes}</button>
    </div>
  );
}

export default Motivation;
