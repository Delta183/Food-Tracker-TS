import { Button, Navbar } from "react-bootstrap";
import { User } from "../../models/user";
import * as NotesApi from "../../network/notes.api";
import { useNavigate } from "react-router-dom";

interface NavBarLoggedInViewProps {
  user: User;
  onLogoutSuccessful: () => void;
}

const NavBarLoggedInView = ({
  user,
  onLogoutSuccessful,
}: NavBarLoggedInViewProps) => {
  const navigate = useNavigate();

  async function logout() {
    try {
      await NotesApi.logout();
      onLogoutSuccessful();
      // Bring the user back to the main page on logging out
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <>
      <Navbar.Text className="me-2">Signed in as: {user.username}</Navbar.Text>
      <Button onClick={logout}>Log out</Button>
    </>
  );
};

export default NavBarLoggedInView;
