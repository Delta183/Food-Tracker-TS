import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Note } from "../../models/note";
import { NoteInput } from "../../network/notes.api";
import * as NotesApi from "../../network/notes.api";
import TextInputField from "../form/TextInputField";

interface AddEditNoteDialogProps {
  noteToEdit?: Note; // Variable to differentiate a note to be added and one to be updated
  onDismiss: () => void;
  onNoteSaved: (note: Note) => void;
}

// The props this component will need when declared with the interface above just making it clear what types they will be
const AddEditNoteDialog = ({
  onDismiss,
  onNoteSaved,
  noteToEdit,
}: AddEditNoteDialogProps) => {
  // Since the hook returns multiple values, we deconstruct the variables
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || "",
    },
  });

  async function onSubmit(input: NoteInput) {
    try {
      let noteResponse: Note;
      // Check for if note is one to edit or one to add, call the according function
      if (noteToEdit) {
        noteResponse = await NotesApi.updateNote(noteToEdit._id, input);
      } else {
        noteResponse = await NotesApi.createNote(input);
      }
      onNoteSaved(noteResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>
          {/* Ternary operator for if in edit or adding */}
          {noteToEdit ? "Edit note" : "Add note"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Our async function had the same name incidentally, curious syntax */}
        <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="title"
            label="title"
            type="text"
            placeholder="Title"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.title}
          />

          <TextInputField
            name="text"
            label="Text"
            as="textarea"
            rows={5}
            placeholder="Text"
            register={register}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        {/* The type is a built in functionality for the button on click
                form also denotes which form of input the button is connected to */}
        <Button type="submit" form="addEditNoteForm" disabled={isSubmitting}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditNoteDialog;
