import { Container } from "react-bootstrap";
import { User } from "../models/user";
import styles from "../styles/MealsPage.module.css";
import MealsPageTestView from "../components/MealsPageComponents/MealsPageTestView";
// import Meals from "../components/MealsPageComponents/Meals"
interface NotesPageProps {
  loggedInUser: User | null;
}

const MealsPage = ({ loggedInUser }: NotesPageProps) => {
  return (
    <Container className={styles.notesPage}>
      <MealsPageTestView/>
    </Container>
  );
};

export default MealsPage;
