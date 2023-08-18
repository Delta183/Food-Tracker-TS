import { Container } from "react-bootstrap";
import SearchContainerComponent from "../components/SearchComponents/SearchContainerComponent";
import { useState } from "react";
import debounce from "../utils/debounce";
import useLocalStorage from "../utils/local_storage_hook";
import findFoodByTagID from "../utils/foodItem_array_helpers";
import { foodSearchItem } from "../models/foodSearchItem";
import {
  calculateStatistics,
  searchFoodsWithQuery,
} from "../network/nutritionix_api";
import ContentContainerComponent from "../components/ContentContainerComponent";
import Swal from "sweetalert2";
import CalculationComponent from "../components/CalculationComponents/CalculationComponent";
import { User } from "../models/user";
import { foodStatsItem } from "../models/foodStatsItem";
import findFoodStatsByTagID from "../utils/foodStats_array_helpers";
import totalsTemplate from "../utils/totalsTemplate";
import {
  incrementValue,
  decrementValue,
  resetValues,
} from "../utils/totals_array_helper";

interface HomePageProps {
  loggedInUser: User | null;
}

const DEBOUNCE_DURATION = 500;
const MAX_SELECTIONS_LENGTH = 20; // There has to be a limit to the foods selected
const LOCAL_STORAGE_SELECTIONS_KEY = "foodSelections";
const LOCAL_STORAGE_CALCULATIONS_KEY = "selectionCalculations";
const LOCAL_STORAGE_TOTALS_KEY = "totals";

// This page is responsible for the current homescreen
const HomePage = ({ loggedInUser }: HomePageProps) => {
  const [totals, setTotals] = useLocalStorage(
    LOCAL_STORAGE_TOTALS_KEY,
    totalsTemplate
  );
  const [input, setInput] = useState("");
  const [foodSelections, setFoodSelections] = useLocalStorage(
    LOCAL_STORAGE_SELECTIONS_KEY,
    Array<foodSearchItem>()
  );
  // These will be saved to local storage to prevent refresh bugs
  const [foodStats, setFoodStats] = useLocalStorage(
    LOCAL_STORAGE_CALCULATIONS_KEY,
    Array<foodStatsItem>()
  );
  const [searchResults, setSearchResults] = useState(Array<foodSearchItem>());
  const [searchResultError, setSearchResultError] = useState<Error | null>(
    null
  );
  // TODO: Manage this error for when this search inevitably yields inaccurate content
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [calculationResultError, setCalculationResultError] =
    useState<Error | null>(null);

  // Use the function in the api class to get a json response in an array and use the states to set it
  const performCalculation = async (foodItem: foodSearchItem) => {
    var query = `${foodItem.quantity} ${foodItem.food_name}, `;
    // A function like this is able to maintain its results and errors and be set within its body
    calculateStatistics(query, (results, error) => {
      setFoodStats((previousFoodStats: foodStatsItem[]) => {
        const existingFoodStats = [...previousFoodStats];
        existingFoodStats.push(results[0]);
        return existingFoodStats;
      }); // The local storage one
      setTotals(incrementValue(results[0], totals));
      setCalculationResultError(error);
      // incrementValues(results);
    });
  };

  // Use the function in the api class to get a json response in an array and use the states to set it
  const performSearch = async (query: string) => {
    // A function like this is able to maintain its results and errors and be set within its body
    searchFoodsWithQuery(query, (results, error) => {
      setSearchResults(results);
      setSearchResultError(error);
    });
  };

  // Clear input and be sure to clear search results
  const onSearchBarClear = async () => {
    setInput("");
    setSearchResults([]);
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
        title: "Maximum Selections reached!",
        text: "Please remove some food selections if you want to make a change.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Fetch the selected item in particular from the Nutritionix API endpoints
    const foodSearchItem = findFoodByTagID(tagID, searchResults);

    // Assuming the food item does exist, it can be set as a selection properly
    if (foodSearchItem !== null) {
      // Toggle that a change occurred for the calculations
      setFoodSelections((previousFoodSelections: foodSearchItem[]) => {
        const existingFoodSelections = [...previousFoodSelections];
        existingFoodSelections.push(foodSearchItem);
        return existingFoodSelections;
      });
      performCalculation(foodSearchItem);
    }
  };

  const removeFoodSelection = async (tagID: string) => {
    setFoodSelections((previousFoodSelections: foodSearchItem[]) => {
      const existingFoodSelections = previousFoodSelections.filter(
        (foodItem: foodSearchItem) => foodItem.tag_id !== tagID
      );
      return existingFoodSelections;
    });

    // Fetch the selected item in particular from the Nutritionix API endpoints
    const foodSearchItem = findFoodStatsByTagID(tagID, foodStats);
    setTotals(decrementValue(foodSearchItem, totals));

    // Prior to removal, decrement the foodStatItem from the totals
    setFoodStats((previousFoodStats: foodStatsItem[]) => {
      const existingFoodStats = previousFoodStats.filter(
        // eslint-disable-next-line eqeqeq
        (foodStat: foodStatsItem) => foodStat.tags["tag_id"] != tagID
      );
      return existingFoodStats;
    });
  };

  const clearFoodSelections = async () => {
    setFoodSelections([]);
    setFoodStats([]);
    setTotals(resetValues(totals));
  };

  return (
    <div>
      {/* Welcome to Food Tracker! With this you can track your calories and other
      statistics with the help of the Nutrionix API. You do not need to sign in
      to make selections and calculations. The site will remember your
      selections from your last visit even! However, to save your selections
      into a meal, you will need to sign in. Please note that your saved meal
      plans will be public so we can share super, healthy or even super healthy
      meals with all users. */}
      <SearchContainerComponent
        input={input}
        onChange={onSearchBarTextChange}
        onSearchBarClear={onSearchBarClear}
      />
      <Container fluid>
        <ContentContainerComponent
          isEditing={false}
          searchResultError={searchResultError}
          results={searchResults}
          query={input}
          MAX_SELECTIONS_LENGTH={MAX_SELECTIONS_LENGTH}
          foodSelections={foodSelections}
          selectionsStats={foodStats}
          totalsArray={totals}
          onAddFoodSelectionClick={addFoodSelection}
          onRemoveFoodSelectionClick={removeFoodSelection}
          onClearFoodSelectionClick={clearFoodSelections}
          user={loggedInUser}
        />
      </Container>
      <CalculationComponent
        calculationResults={foodStats}
        totalsArray={totals}
      />
    </div>
  );
};

export default HomePage;
