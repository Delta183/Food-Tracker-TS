import { Container } from "react-bootstrap";
import { User } from "../models/user";
import styles from "../styles/MealsPage.module.css";
import useLocalStorage from "../utils/local_storage_hook";
import MealsPageTestView from "../components/MealsPageComponents/MealsPageTestView";
import { foodSearchItem } from "../models/foodSearchItem";
import MealsPageLoggedInView from "../components/MealsPageComponents/MealsPageLoggedInView";
// import Meals from "../components/MealsPageComponents/Meals"
interface NotesPageProps {
  loggedInUser: User | null;
}

const MealsPage = ({ loggedInUser }: NotesPageProps) => {
  const LOCAL_STORAGE_NOMINATIONS_KEY = "foodSelections";
  const [foodSelections, setFoodSelections] = useLocalStorage(
    LOCAL_STORAGE_NOMINATIONS_KEY,
    Array<foodSearchItem>()
  );
  return (
    <Container className={styles.notesPage}>
      <MealsPageLoggedInView selections={foodSelections}/>
    </Container>
  );
};

export default MealsPage;
