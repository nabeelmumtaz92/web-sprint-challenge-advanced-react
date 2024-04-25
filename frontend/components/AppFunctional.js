import React, { useState } from 'react';

const AppFunctional = () => {
  const [index, setIndex] = useState(4); // Initialize at the center of the grid (index 4)
  const [email, setEmail] = useState('');
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState('');

  // Function to handle movement based on direction
  const handleMove = (direction) => {
    let newIndex = index;
    const row = Math.floor(index / 3);
    const col = index % 3;

    switch (direction) {
      case 'up':
        if (row > 0) newIndex -= 3;
        break;
      case 'down':
        if (row < 2) newIndex += 3;
        break;
      case 'left':
        if (col > 0) newIndex -= 1;
        break;
      case 'right':
        if (col < 2) newIndex += 1;
        break;
      default:
        break;
    }

    if (newIndex !== index) {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage(''); // Clear message on successful move
    } else {
      setMessage(`You can't go ${direction}`); // Set message if move is not possible
    }
  };

  // Reset function to clear all states
  const handleReset = () => {
    setIndex(4);
    setEmail('');
    setSteps(0);
    setMessage('');
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;

    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y, steps, email })
    })
    .then(response => response.json())
    .then(data => {
      setMessage(response.ok ? `Success: ${data.message}` : `Error: ${data.message}`);
    })
    .catch(error => {
      setMessage(`Network error: ${error.toString()}`);
    });
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
