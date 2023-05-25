import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import {Button, Container, Row, Col} from 'react-bootstrap';
import {Note as NoteModel} from './models/note';
import Note from './components/Note';
import styles from './styles/NotesPage.module.css';

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
    <Container>
      boi
      <Row xs={1} md={2} xl={3} className='g-4'>
      {/* .map allows us to use our array of elements for something */}
      {notes.map(note => (
        <Col key={note._id}>
          <Note note={note} className={styles.note}/>
        </Col>
      ))}
      </Row>
    </Container>
  );
}

export default App;
