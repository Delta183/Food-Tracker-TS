import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import {Button} from 'react-bootstrap';
import {Note as NoteModel} from './models/note';
import Note from './components/Note';

function App() {
  // React needs a special type of variable for updated value
  // Using <> allows us to declare the type of the react variables
  const [notes, setNotes] = useState<NoteModel[]>([]);

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
    <div>
      boi
      {/* .map allows us to use our array of elements for something */}
      {notes.map(note => (
        <Note note={note} key={note._id}/>
      ))}
    </div>
  );
}

export default App;
