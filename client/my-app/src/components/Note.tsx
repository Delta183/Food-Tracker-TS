import styles from '../styles/Note.module.css'
import { Card } from "react-bootstrap";
// This is aliasing (x as y) just so we can refer to it as a name that is different
import { Note as NoteModel } from "../models/note";


// An interface to declare what variables the Note needs
// It can be done without it in JS but its not as certain
// Props is the arguments unto which we pass to the component.
interface NoteProps {
    note: NoteModel
}

const Note = ({ note}: NoteProps) => {
    // Unpacking the note model
    const {
        title,
        text,
        createdAt,
        updatedAt
    } = note;
    return (
        <Card className={styles.noteCard}>
            <Card.Body>
                <Card.Title>
                    {title}
                </Card.Title>
                <Card.Text className={styles.cardText   }>
                    {text}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Note;