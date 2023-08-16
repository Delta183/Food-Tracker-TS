import { Container } from "react-bootstrap";
import { User } from "../models/user";
import styles from "../styles/MealsPage.module.css";
import UserMealsPageLoggedInView from "../components/UserMealsPageComponents/UserMealsPageLoggedInView";
import UserMealsPageLoggedOutView from "../components/UserMealsPageComponents/UserMealsPageLoggedOutView";

interface MealsPageProps {
  loggedInUser: User | null;
}

const UserMealsPage = ({ loggedInUser }: MealsPageProps) => {
  return (
    <Container className={styles.mealsPage}>
      {loggedInUser ? (
        <UserMealsPageLoggedInView loggedInUser={loggedInUser} />
      ) : (
        <UserMealsPageLoggedOutView />
      )}
    </Container>
  );
};

export default UserMealsPage;
