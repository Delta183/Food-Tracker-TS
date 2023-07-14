import { Container } from "react-bootstrap";
import LoginModal from "./components/SignLogin/LoginModal";
import NavBar from "./components/NavBarComponents/NavBar";
import SignUpModal from "./components/SignLogin/SignUpModal";
import styles from "./styles/App.module.css";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "./models/user";
import * as NotesApi from "./network/notes.api";
import NotesPage from "./pages/NotesPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPage from "./pages/PrivacyPage";
import HomePage from "./pages/HomePage";
import MealsPage from "./pages/MealsPage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // The functions maintained here are called once on the bootup and not on every refresh
    async function fetchLoggedInUser() {
      try {
        const user = await NotesApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <BrowserRouter>
      <NavBar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setShowLoginModal(true)}
        onSignUpClicked={() => setShowSignUpModal(true)}
        onLogoutSuccessful={() => setLoggedInUser(null)}
      />
      {/* This will determine which page is shown to the user per the router */}
      <Container className={styles.pageContainer}>
        <Routes>
          {/* In the case of Homepage, only logged in users can save meals */}
          <Route path="/" element={<HomePage loggedInUser={loggedInUser} />} />
          <Route
            path="/notes"
            element={<NotesPage loggedInUser={loggedInUser} />}
          />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/meals" element={<MealsPage loggedInUser={loggedInUser}/>}/>
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Container>
      {/* Sign and Login modals below */}
      {showSignUpModal && (
        <SignUpModal
          onDismiss={() => setShowSignUpModal(false)}
          onSignUpSuccessful={(user) => {
            setLoggedInUser(user);
            setShowSignUpModal(false);
          }}
        />
      )}
      {showLoginModal && (
        <LoginModal
          onDismiss={() => setShowLoginModal(false)}
          onLoginSuccessful={(user) => {
            setLoggedInUser(user);
            setShowLoginModal(false);
          }}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
