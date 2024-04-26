import React, { useState } from 'react';

const AppFunctional = ({ className }) => {
    const [index, setIndex] = useState(4); // Center of the grid
    const [email, setEmail] = useState('');
    const [steps, setSteps] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const getCoordinates = () => {
        return {
            x: (index % 3) + 1,
            y: Math.floor(index / 3) + 1
        };
    };

    const getNextIndex = (direction) => {
        const row = Math.floor(index / 3);
        const col = index % 3;

        switch (direction) {
            case 'left': return col > 0 ? index - 1 : index;
            case 'up': return row > 0 ? index - 3 : index;
            case 'right': return col < 2 ? index + 1 : index;
            case 'down': return row < 2 ? index + 3 : index;
            default: return index;
        }
    };

    const move = (direction) => {
        const newIndex = getNextIndex(direction);
        if (newIndex !== index) {
            setIndex(newIndex);
            setSteps(steps => steps + 1);
            setErrorMessage(''); // Clear error message upon successful movement
        } else {
            setErrorMessage(`You can't go ${direction}`);
        }
    };

    const reset = () => {
        setIndex(4);
        setEmail('');
        setSteps(0);
        setErrorMessage('');
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      const { x, y } = getCoordinates();
  
      try {
          const response = await fetch('http://localhost:9000/api/result', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ x, y, steps, email })
          });
          const data = await response.json();
          if (!response.ok) {
              throw new Error(data.message);
          }
          setErrorMessage(`Success: ${data.message}`);
          setEmail(''); // Reset email after successful submission
      } catch (error) {
          setErrorMessage(`Error: ${error.message}`);
      }
  };
  

    return (
        <div id="wrapper" className={className}>
        <div className="info">
            <h3 id="coordinates">Coordinates ({getCoordinates().x}, {getCoordinates().y})</h3>
            <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
        </div>

            <div id="grid">
                {Array.from({ length: 9 }).map((_, idx) => (
                    <div key={idx} className={`square${index === idx ? ' active' : ''}`} onClick={() => move(idx)}>
                        {index === idx ? 'B' : ''}
                    </div>
                ))}
            </div>
            <div className="info">
                <h3 id="message" style={{ color: '#00808c' }}>{errorMessage}</h3> 
            </div>
            <div id="keypad">
                <button id="left" onClick={() => move('left')}>LEFT</button>
                <button id="up" onClick={() => move('up')}>UP</button>
                <button id="right" onClick={() => move('right')}>RIGHT</button>
                <button id="down" onClick={() => move('down')}>DOWN</button>
                <button id="reset" onClick={reset}>reset</button>
            </div>
            <form onSubmit={handleSubmit}>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Type email" />
                <button id="submit" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AppFunctional;
