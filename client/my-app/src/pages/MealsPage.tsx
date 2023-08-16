import { Container } from "react-bootstrap";
import { User } from "../models/user";
import styles from "../styles/MealsPage.module.css";
import MealsPageLoggedInView from "../components/MealsPageComponents/MealsPageLoggedInView";
import MealsPageLoggedOutView from "../components/MealsPageComponents/MealsPageLoggedOutView";

interface MealsPageProps {
  loggedInUser: User | null;
}

const MealsPage = ({ loggedInUser }: MealsPageProps) => {
  return (
    <Container className={styles.mealsPage}>
      {loggedInUser ? (
        <MealsPageLoggedInView loggedInUser={loggedInUser} />
      ) : (
        <MealsPageLoggedOutView />
      )}
    </Container>
  );
};

export default MealsPage;
