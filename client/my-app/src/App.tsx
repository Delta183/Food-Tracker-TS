import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import {Button, Container, Row, Col} from 'react-bootstrap';
import {Note as NoteModel} from './models/note';
import Note from './components/Note';
import styles from './styles/NotesPage.module.css';
import stylesUtils from './styles/utils.module.css';
import * as NotesApi from './network/notes.api';
import AddEditNoteDialog from './components/AddEditNoteDialog';
import { FaPlus } from "react-icons/fa";

function App() {
  // React needs a special type of variable for updated value
  // Using <> allows us to declare the type of the react variables
  const [notes, setNotes] = useState<NoteModel[]>([]);

  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  useEffect(() => {
    // Await functions need to be async
    async function loadNotes() {
      try {
        // Anything under the function header is run on every render, useEffect allows it to be done once
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    // Call the functions afterwards
    loadNotes();
  }, []); // passing the empty array allows this to run only one time

  // Delete Note logic
  async function deleteNote(note: NoteModel) {
		try {
			await NotesApi.deleteNote(note._id);
      // Go through each note of the array and only includes them if the id does not match the given one
      // Thus resulting in its removal from the app
			setNotes(notes.filter(existingNote => existingNote._id !== note._id));
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

  
  return (
    <Container>
      {/* This button will prompt the add note dialog */}
      <Button 
        className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}
      >
        <FaPlus />
        Add New Note
      </Button>
      <Row xs={1} md={2} xl={3} className='g-4'>
      {/* .map allows us to use our array of elements for something */}
      {notes.map(note => (
        <Col key={note._id}>
          <Note 
            note={note} 
            className={styles.note}
            onNoteClicked={setNoteToEdit}
            onDeleteNoteClicked={deleteNote}
          />
        </Col>
      ))}
      </Row>
      {/* Will only show whatever appears after && if the variable is true */}
      {/* We could do it by passing the variable in the component but that will keep the component active */}
      { showAddNoteDialog &&
      <AddEditNoteDialog 
      onDismiss={() => setShowAddNoteDialog(false)}
      onNoteSaved={(newNote) => {
        // Creates a new array, adds the notes that exist currently in which we will add the newest one afterwards
        setNotes([...notes, newNote])
        // Be sure to close the dialog as well
        setShowAddNoteDialog(false)
      }}
      />
      }
      {/* The update card component that only appears once editing begins */}
      {noteToEdit &&
				<AddEditNoteDialog
					noteToEdit={noteToEdit}
					onDismiss={() => setNoteToEdit(null)}
					onNoteSaved={(updatedNote) => {
            // The function needed to map all the notes but ensure the edited one has its new information
						setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote));
						setNoteToEdit(null);
					}}
				/>
			}
    </Container>
  );
}

export default App;
