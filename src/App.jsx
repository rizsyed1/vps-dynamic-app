import { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [count, setCount] = useState(0);
   
  function handleIncrement() {
     axios
      .post('/api/data', {count: count + 1})
      .then(_ => {
        setCount(count + 1);
      })
  };

  function handleDecrement() {
    axios
      .post('/api/data', {count: count - 1})
      .then(_ => {
        setCount(count - 1);
      })
  };

  return (
    <div className="counter-controls">
      <h1>Counter</h1>
      <DecrementButton count={count} onClick={handleDecrement} />
      {count}
      <IncrementButton count={count} onClick={handleIncrement} />
    </div>
  );
}

function IncrementButton({ onClick }) {
  return (
    <button onClick={onClick}>
      +
    </button>
  );
}

function DecrementButton({ onClick }) {
  return (
    <button onClick={onClick}>
      -
    </button>
  );
}

export default App
