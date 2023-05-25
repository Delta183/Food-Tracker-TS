import styles from '../styles/Note.module.css'
import { formatDate } from "../utils/formatDate";
import { Card } from "react-bootstrap";
// This is aliasing (x as y) just so we can refer to it as a name that is different
import { Note as NoteModel } from "../models/note";


// An interface to declare what variables the Note needs
// It can be done without it in JS but its not as certain
// Props is the arguments unto which we pass to the component.
interface NoteProps {
    note: NoteModel,
    className?: string,
}

// Prior to NoteProps is the chunk of the arguments that will be passed
const Note = ({note, className}: NoteProps) => {
    // Unpacking the note model
    const {
        title,
        text,
        createdAt,
        updatedAt
    } = note;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }


    return (
        // The second className here is the props, not a typo dupe
        <Card className={`${styles.noteCard} ${className}`}>
            <Card.Body>
                <Card.Title className={styles.cardBody}>
                    {title}
                </Card.Title>
                <Card.Text className={styles.cardText   }>
                    {text}
                </Card.Text>
            </Card.Body>
            <Card.Footer className='text-muted'>
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )
}

export default Note;