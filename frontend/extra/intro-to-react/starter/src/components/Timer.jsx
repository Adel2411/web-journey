import React, { useState, useEffect } from 'react';
import '../styles/Timer.css';

const Timer = ({ onSessionComplete }) => {
  const initialTime = 25 * 60; // 25 minutes
  const [seconds, setSeconds] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning && !isPaused && seconds > 0) {
      interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    }

    if (seconds === 0 && isRunning) {
      onSessionComplete();
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, seconds, onSessionComplete]);

  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const handleReset = () => {
    setIsRunning(true);
    setIsPaused(false);
    setSeconds(initialTime);
  };

  return (
    <div className="timer">
      <h2 className="timer-title">⏱️ Time Left</h2>
      <div className="time-display">{formatTime()}</div>

      <div className="timer-buttons">
        <button onClick={handlePauseResume}>
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        <button onClick={handleReset}>🔄 Reset</button>
      </div>
    </div>
  );
};

export default Timer;

