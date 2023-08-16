import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";

interface NavBarProps {
  loggedInUser: User | null;
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccessful: () => void;
}

const NavBar = ({
  loggedInUser,
  onSignUpClicked,
  onLoginClicked,
  onLogoutSuccessful,
}: NavBarProps) => {
  return (
    <Navbar bg="dark" variant="dark" expand="sm" fixed="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Food Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav>
            {/* Links below for the pages of the website */}
            <Nav.Link as={Link} to="/meals">
              Meals
            </Nav.Link>
            <Nav.Link as={Link} to="/meals/user">
              Your Meals
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {loggedInUser ? (
              <NavBarLoggedInView
                user={loggedInUser}
                onLogoutSuccessful={onLogoutSuccessful}
              />
            ) : (
              <NavBarLoggedOutView
                onLoginClicked={onLoginClicked}
                onSignUpClicked={onSignUpClicked}
              />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
