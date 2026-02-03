import { useState } from 'react'
import './App.css'
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://www.riz-syed.co.uk/api'
})

function App() {
  const [count, setCount] = useState(0);
  

  function handleIncrement() {
    axiosInstance
      .post('/api', {count: count + 1})
      .catch(err => console.error(err));
    setCount(count + 1);
  }

  function handleDecrement() {
     axiosInstance
      .post('/api', {count: count - 1})
      .catch(err => console.error(err));
    setCount(count - 1);
  }

  return (
    <div>
      <DecrementButton onClick={handleDecrement} />
        {count}
       <IncrementButton onClick={handleIncrement} />
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
