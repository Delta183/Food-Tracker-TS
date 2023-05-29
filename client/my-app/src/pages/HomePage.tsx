import { Container } from "react-bootstrap";
import styles from "../styles/NotesPage.module.css";
import SearchContainerComponent from "../components/SearchComponents/SearchContainerComponent";
import { useState } from "react";

// This page is responsible for the current homescreen
const HomePage = () => {
  const [input, setInput] = useState("");

  // eslint-disable-next-line
  const performSearch = async (query: string) => {
    console.log("guh");
  };

  const onSearchBarTextChange = async (text: string) => {
    setInput(text);
  };

  return (
    <Container className={styles.notesPage}>
      <div>
        Welcome to Food Tracker! With this you can track your calories and other
        statistics with the help of the Nutrionix API.
      </div>
      <SearchContainerComponent
        input={input}
        onChange={onSearchBarTextChange}
      />
    </Container>
  );
};

export default HomePage;
