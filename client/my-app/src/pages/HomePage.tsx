import { Container } from "react-bootstrap";
import styles from "../styles/NotesPage.module.css";
import SearchContainerComponent from "../components/SearchComponents/SearchContainerComponent";
import { useState } from "react";
import debounce from "../utils/debounce";
import { foodSearchItem } from "../models/foodSearchItem";
import searchFoodsWithQuery from "../network/nutritionix_api";
import ContentContainerComponent from "../components/ContentContainerComponent";

const DEBOUNCE_DURATION = 500;


// This page is responsible for the current homescreen
const HomePage = () => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState(Array<foodSearchItem>());
  const [searchResultError, setSearchResultError] = useState<Error | null>(
    null
  );

  // Use the function in the api class to get a json response in an array and use the states to set it
  const performSearch = async (query: string) => {
    searchFoodsWithQuery(query, (results, error) => {
      console.log(results)
      setSearchResults(results);
      setSearchResultError(error);
    });
  };

  // Set input to be text on change but ensure a debounce is run before performing the search
  const onSearchBarTextChange = async (text: string) => {
    setInput(text);
    const debouncedFunction = debounce(function () {
      performSearch(text);
    }, DEBOUNCE_DURATION);
    debouncedFunction();
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
      <ContentContainerComponent
       searchResultError={searchResultError}
       results={searchResults}
       query={input}
      />
    </Container>
  );
};

export default HomePage;
