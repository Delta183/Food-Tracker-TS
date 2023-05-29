import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
}

const NavBarLoggedOutView = ({
  onSignUpClicked,
  onLoginClicked,
}: NavBarLoggedOutViewProps) => {
  return (
    <div>
      {/* Oddly, putting it in the div didn't change anything */}
      <Button className="me-2" onClick={onSignUpClicked}>
        Sign Up
      </Button>
      <Button className="me-2" onClick={onLoginClicked}>
        Log In
      </Button>
    </div>
  );
};

export default NavBarLoggedOutView;
