import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Note } from "../models/note";
import { NoteInput } from "../network/notes.api";
import * as NotesApi from "../network/notes.api";


interface AddNoteDialogProps {
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
}

// The props this component will need when declared with the interface above just making it clear what types they will be
const AddNoteDialog = ({onDismiss, onNoteSaved}: AddNoteDialogProps) => {

    // Since the hook returns multiple values, we deconstruct the variables
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteInput>();

    async function onSubmit(input: NoteInput) {
        try {
            const noteResponse = await NotesApi.createNote(input);
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
                    Add Note
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Our async function had the same name incidentally, curious syntax */}
                <Form id="addNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Title"
                            {...register("title", { required: "Required" })}
                        />
                        {/* This is used to provide the feedback for good or bad input */}
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Text"
                            {...register("text")}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                {/* The type is a built in functionality for the button on click
                form also denotes which form of input the button is connected to */}
                <Button
                    type="submit"
                    form="addNoteForm"
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default AddNoteDialog;

