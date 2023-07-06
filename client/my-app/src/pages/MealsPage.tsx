import { Container } from "react-bootstrap";
import { User } from "../models/user";
import styles from "../styles/NotesPage.module.css";
import Meals from "../components/MealsPageComponents/Meals"
interface NotesPageProps {
  loggedInUser: User | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
  return (
    <Container className={styles.notesPage}>
    </Container>
  );
};

export default NotesPage;
