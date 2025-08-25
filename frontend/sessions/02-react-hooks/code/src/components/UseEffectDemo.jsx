import React, { useState, useEffect } from "react";

function UseEffectDemo() {
  const [count, setCount] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Effect with no dependencies - runs after every render
  useEffect(() => {
    document.title = `Count: ${count}`;
  });

  // Effect with empty dependencies - runs once on mount
  useEffect(() => {
    console.log("Component mounted!");
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  // Effect with cleanup - window resize listener
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Timer effect with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Data fetching effect
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo-container">
      <p className="demo-description">
        Learn how to handle side effects and lifecycle events with useEffect.
      </p>

      {/* Document Title Effect */}
      <div className="demo-card">
        <h3><span>📄</span> Document Title Sync</h3>
        <div className="demo-card-content">
          <p className="demo-note">The document title updates with the count!</p>
          <div className="counter-display">{count}</div>
          <button 
            className="demo-button"
            onClick={() => setCount(count + 1)}
          >
            Update Count (& Title)
          </button>
        </div>
      </div>

      {/* Window Size Tracker */}
      <div className="demo-card">
        <h3><span>📏</span> Window Size Tracker</h3>
        <div className="demo-card-content">
          <p className="demo-note">Resize your window to see real-time updates!</p>
          <div className="size-display">
            {windowSize.width} × {windowSize.height}
          </div>
          <div className="device-type">
            {windowSize.width < 768 ? "📱 Mobile" : "💻 Desktop"} View
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="demo-card">
        <h3><span>⏱️</span> Auto Timer</h3>
        <div className="demo-card-content">
          <p className="demo-note">Running since component mounted:</p>
          <div className="timer-display">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </div>
          <p className="demo-hint">
            <span>🧹</span> Timer will cleanup when component unmounts
          </p>
        </div>
      </div>

      {/* Data Fetching */}
      <div className="demo-card">
        <h3><span>🌐</span> Data Fetching</h3>
        <div className="demo-card-content">
          <button 
            className="demo-button"
            onClick={fetchPosts}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch Sample Posts"}
          </button>
          
          {posts.length > 0 && (
            <div className="posts-container">
              {posts.map(post => (
                <div key={post.id} className="post-item">
                  <h4>{post.title}</h4>
                  <p>{post.body.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* useEffect Patterns */}
      <div className="demo-card">
        <h3><span>📝</span> useEffect Patterns</h3>
        <div className="patterns-grid">
          <div className="pattern-item">
            <h4>No Dependencies</h4>
            <code>{'useEffect(() => {})'}</code>
            <p>Runs after every render</p>
          </div>
          
          <div className="pattern-item">
            <h4>Empty Array</h4>
            <code>{'useEffect(() => {}, [])'}</code>
            <p>Runs once on mount</p>
          </div>
          
          <div className="pattern-item">
            <h4>With Dependencies</h4>
            <code>{'useEffect(() => {}, [value])'}</code>
            <p>Runs when value changes</p>
          </div>
          
          <div className="pattern-item">
            <h4>With Cleanup</h4>
            <code>{'return () => cleanup()'}</code>
            <p>Cleanup on unmount</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UseEffectDemo;
