import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {Button} from 'react-bootstrap';

function App() {
  // React needs a special type of variable for updated value
  const [clickCount, setClickCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Subscribe for more MIX
        </p>
        {/* This is how anonymous functions are passed */}
       <Button onClick={() => setClickCount(clickCount+1)}>
        {/* using the squiggly brackets to use the react variables */}
        Clicked {clickCount} times
       </Button>
        
      </header>
    </div>
  );
}

export default App;
