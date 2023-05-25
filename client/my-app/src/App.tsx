import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {Button} from 'react-bootstrap';
import {Note} from './models/note'

function App() {
  // React needs a special type of variable for updated value
  // Using <> allows us to declare the type of the react variables
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Await functions need to be async
    async function loadNotes() {
      try {
        // Anything under the function header is run on every render, useEffect allows it to be done once
        const response = await fetch("/api/notes", {method: "GET"});
        const notes = await response.json();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    // Call the functions afterwards
    loadNotes();
  }, []); // passing the empty array allows this to run only one time

  return (
    <div className="App">
      {JSON.stringify(notes)}
    </div>
  );
}

export default App;
