import React, { useState } from 'react';

const AppFunctional = () => {
  const [index, setIndex] = useState(4);  // Start from the center of the grid
  const [email, setEmail] = useState('');
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState('');

  const handleMove = (newIndex) => {
    if (newIndex < 0 || newIndex > 8) {
      setMessage("You can't move outside the grid boundaries.");
      return; // Prevent moving outside the grid
    }

    if (newIndex !== index) {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage(''); // Clear any existing messages on valid move
    }
  };

  const handleReset = () => {
    setIndex(4);
    setEmail('');
    setSteps(0);
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;

    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y, steps, email })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.message}`);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Network error: ${error.toString()}`);
    }
  };

  return (
    <div id="wrapper">
      <div id="grid">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div key={idx} className={`square ${index === idx ? 'active' : ''}`} onClick={() => handleMove(idx)}>
            {index === idx ? 'B' : ''}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="coordinates">Coordinates ({(index % 3) + 1}, {Math.floor(index / 3) + 1})</h3>
        <h3 id="steps">You moved {steps} times</h3>
        <h3 id="message">{message}</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Type email" />
        <button type="submit">Submit</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
    </div>
  );
};

export default AppFunctional;
