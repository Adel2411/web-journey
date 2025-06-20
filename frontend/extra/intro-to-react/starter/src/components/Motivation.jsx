import React, { useEffect, useState } from 'react';
import '../styles/Motivation.css';

const Motivation = ({ sessionCount }) => {
  const [likes, setLikes] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (sessionCount > 0) {
      setShowMessage(true);
      const timeout = setTimeout(() => setShowMessage(false), 4000); // disparaît après 4s
      return () => clearTimeout(timeout);
    }
  }, [sessionCount]);

  const message = `🎉 Great job! You’ve completed  ${sessionCount} session${sessionCount > 1 ? 's' : ''} !`;

  return (
    <div className="motivation">
      {showMessage && <div className="motivation-msg">{message}</div>}

      <p>You did great ! Continue 💪</p>
      <button onClick={() => setLikes(l => l + 1)}>❤️ {likes}</button>
    </div>
  );
};

export default Motivation;

