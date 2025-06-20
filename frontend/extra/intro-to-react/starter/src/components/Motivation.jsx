import React, { useState } from 'react';
import '../styles/Motivation.css';

const Motivation = ({ sessionCount }) => {
  const [likes, setLikes] = useState(0);

  const message = `🎉 Great job! You’ve completed ${sessionCount} session${sessionCount > 1 ? 's' : ''} !`;

  return (
    <div className="motivation">
      {sessionCount > 0 && <div className="motivation-msg">{message}</div>}

      <p>You did great ! Continue 💪</p>
      <button onClick={() => setLikes((l) => l + 1)}>❤️ {likes}</button>
    </div>
  );
};

export default Motivation;


