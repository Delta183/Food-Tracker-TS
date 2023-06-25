import { Container } from "react-bootstrap";
// import styles from "../styles/FoodSearch.module.css";
import SearchContainerComponent from "../components/SearchComponents/SearchContainerComponent";
import { useState } from "react";
import debounce from "../utils/debounce";
import useLocalStorage from "../utils/local_storage_hook";
import findFoodByTagID from "../utils/foodItem_array_helpers";
import { foodSearchItem } from "../models/foodSearchItem";
import { searchFoodsWithQuery } from "../network/nutritionix_api";
import ContentContainerComponent from "../components/ContentContainerComponent";
import Swal from "sweetalert2";
import CalculationComponent from "../components/CalculationComponents/CalculationComponent";

// The duration to be waited for prior to actually performing the API call
const DEBOUNCE_DURATION = 500;
const MAX_SELECTIONS_LENGTH = 50; // There has to be a limit to the foods selected
const LOCAL_STORAGE_NOMINATIONS_KEY = "foodSelections";

// This page is responsible for the current homescreen
const HomePage = () => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState(Array<foodSearchItem>());
  const [foodSelections, setFoodSelections] = useLocalStorage(
    LOCAL_STORAGE_NOMINATIONS_KEY,
    Array<foodSearchItem>()
  );
  const [searchResultError, setSearchResultError] = useState<Error | null>(
    null
  );

  // Use the function in the api class to get a json response in an array and use the states to set it
  const performSearch = async (query: string) => {
    // A function like this is able to maintain its results and errors and be set within its body
    searchFoodsWithQuery(query, (results, error) => {
      setSearchResults(results);
      setSearchResultError(error);
    });
  };

  // Set input to be text on change but ensure a debounce is run before performing the search
  const onSearchBarTextChange = async (text: string) => {
    // Set the input to be whatever that text is on change but only send it after the debounce duration elapses
    setInput(text);
    const debouncedFunction = debounce(function () {
      performSearch(text);
    }, DEBOUNCE_DURATION);
    debouncedFunction();
  };

  const addFoodSelection = async (tagID: string) => {
    // Ensure the selections do not surpass the limit, otherwise additional selections cannot be done
    if (foodSelections.length >= MAX_SELECTIONS_LENGTH) {
      // Fire the sweet alert if the limit has been reached
      Swal.fire({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Cool",
      });
      return;
    }

    // Fetch the selected item in particular from the Nutritionix API endpoints
    const foodSearchItem = findFoodByTagID(tagID, searchResults);

    // Assuming the food item does exist, it can be set as a selection properly
    if (foodSearchItem !== null) {
      setFoodSelections((previousFoodSelections: foodSearchItem[]) => {
        const existingFoodSelections = [...previousFoodSelections];
        existingFoodSelections.push(foodSearchItem);
        return existingFoodSelections;
      });
    }
  };

  const removeFoodSelection = async (tagID: string) => {
    setFoodSelections((previousFoodSelections: foodSearchItem[]) => {
      const existingFoodSelections = previousFoodSelections.filter(
        (foodItem: foodSearchItem) => foodItem.tag_id !== tagID
      );
      return existingFoodSelections;
    });
  };

  return (
    <div>
      Welcome to Food Tracker! With this you can track your calories and other
      statistics with the help of the Nutrionix API.
      <SearchContainerComponent
        input={input}
        onChange={onSearchBarTextChange}
      />
      {/* This is where the results will be for now */}
      <CalculationComponent 
      foodSelections={foodSelections}/>
      <Container fluid>
        <ContentContainerComponent
          searchResultError={searchResultError}
          results={searchResults}
          query={input}
          MAX_SELECTIONS_LENGTH={MAX_SELECTIONS_LENGTH}
          foodSelections={foodSelections}
          onAddFoodSelectionClick={addFoodSelection}
          onRemoveFoodSelectionClick={removeFoodSelection}
        />
      </Container>
    </div>
  );
};

export default HomePage;
