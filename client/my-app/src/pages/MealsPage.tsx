import { Container } from "react-bootstrap";
import { User } from "../models/user";
import styles from "../styles/MealsPage.module.css";
import MealsPageLoggedInView from "../components/MealsPageComponents/MealsPageLoggedInView";
import MealsPageLoggedOutView from "../components/MealsPageComponents/MealsPageLoggedOutView";
// import Meals from "../components/MealsPageComponents/Meals"
interface NotesPageProps {
  loggedInUser: User | null;
}

const MealsPage = ({ loggedInUser }: NotesPageProps) => {
 
  return (
    <Container className={styles.mealsPage}>
       {loggedInUser ? <MealsPageLoggedInView/> :<MealsPageLoggedOutView/>}
    </Container>
  );
};

export default MealsPage;
