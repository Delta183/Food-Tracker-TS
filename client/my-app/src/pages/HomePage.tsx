import { Container } from "react-bootstrap";
import SearchContainerComponent from "../components/SearchComponents/SearchContainerComponent";
import {useEffect, useState } from "react";
import debounce from "../utils/debounce";
import useLocalStorage from "../utils/local_storage_hook";
import findFoodByTagID from "../utils/foodItem_array_helpers";
import { foodSearchItem } from "../models/foodSearchItem";
import { calculateStatistics, searchFoodsWithQuery } from "../network/nutritionix_api";
import ContentContainerComponent from "../components/ContentContainerComponent";
import Swal from "sweetalert2";
import CalculationComponent from "../components/CalculationComponents/CalculationComponent";
import { User } from "../models/user";
import { foodStatsItem } from "../models/foodStatsItem";
import {totalsArray} from "../models/totalsArray"

interface HomePageProps {
  loggedInUser: User | null;
}

// The duration to be waited for prior to actually performing the API call
const totalsTemplate : totalsArray = {
  calories: 0,
  totalFat: 0,
  saturatedFat: 0,
  cholesterol: 0,
  sodium: 0,
  totalCarbs: 0,
  fiber: 0,
  sugars: 0,
  protein: 0,
  potassium: 0
};
const DEBOUNCE_DURATION = 500;
const MAX_SELECTIONS_LENGTH = 50; // There has to be a limit to the foods selected
const LOCAL_STORAGE_SELECTIONS_KEY = "foodSelections";
const LOCAL_STORAGE_CALCULATIONS_KEY = "selectionCalculations";


// This page is responsible for the current homescreen
const HomePage = ({ loggedInUser }: HomePageProps) => {
  const [didChangeOccur, setDidChangeOccur] = useState(true);
  const [totals, setTotals] = useState(totalsTemplate);
  const [input, setInput] = useState("");
  const [foodSelections, setFoodSelections] = useLocalStorage(
    LOCAL_STORAGE_SELECTIONS_KEY,
    Array<foodSearchItem>()
  );
  const [selectionCalculations, setSelectionCalculations] = useLocalStorage(
    LOCAL_STORAGE_CALCULATIONS_KEY,
    Array<foodStatsItem>()
  );
  const [searchResults, setSearchResults] = useState(Array<foodSearchItem>());
  const [searchResultError, setSearchResultError] = useState<Error | null>(
    null
  );
  const [calculationResults, setCalculationResults] = useState(Array<foodStatsItem>());
  // TODO: Manage this error for when this search inevitably yields inaccurate content
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [calculationResultError, setCalculationResultError] =
    useState<Error | null>(null);

  // Use the function in the api class to get a json response in an array and use the states to set it
  const performCalculation = async (query: string) => {
    // A function like this is able to maintain its results and errors and be set within its body
    calculateStatistics(query, (results, error) => {
      setCalculationResults(results);
      setCalculationResultError(error);
      incrementValues(results);
    });
  };

  // Have this function be automatic on each addition on the item and set an array in the parent component
  const calculateStats = async () => {
    // Only allow the calculation if a change did occur
    if (didChangeOccur){
      // be sure to reset the values for the next calculation
      resetValues();
      var searchQuery = "";
      // So far this is working with the right string but that bug of the last item in the selection persists
      foodSelections.forEach((foodItem : foodSearchItem) => {
        var foodString = `${foodItem.quantity} ${foodItem.food_name}, `;
        searchQuery += foodString;
      });
      performCalculation(searchQuery);
      // console.log("home: " + calculationResults)
      // Set this to false upon any calculation to prevent redundant clicks
      setDidChangeOccur(false)
    }
  };

  // Upon the start of another calculation, we have to be sure to reset the values
  const resetValues = () => {
    const currentTotals = totals;
    currentTotals.calories = 0;
    currentTotals.totalFat = 0;
    currentTotals.saturatedFat = 0;
    currentTotals.cholesterol = 0;
    currentTotals.sodium = 0;
    currentTotals.totalCarbs = 0;
    currentTotals.fiber = 0;
    currentTotals.sugars = 0;
    currentTotals.protein = 0;
    currentTotals.potassium = 0;
    setTotals(currentTotals);
  };

  // incrementing values with each item read in the selections array
  const incrementValues = (calculationResults: Array<foodStatsItem>) => {
    const currentTotals = totals;
    calculationResults.forEach((result) => {
      currentTotals.calories += result.nf_calories;
      currentTotals.totalFat += result.nf_total_fat;
      currentTotals.saturatedFat += result.nf_saturated_fat;
      currentTotals.cholesterol += result.nf_cholesterol;
      currentTotals.sodium += result.nf_sodium;
      currentTotals.totalCarbs += result.nf_total_carbohydrate;
      currentTotals.fiber += result.nf_dietary_fiber;
      currentTotals.sugars += result.nf_sugars;
      currentTotals.protein += result.nf_protein;
      currentTotals.potassium += result.nf_potassium;
    })
    // console.log(currentStats[0])
    setTotals(currentTotals);
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
        text: "Please remove some food selections if you want to make a change",
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
      setDidChangeOccur(true)
      setFoodSelections((previousFoodSelections: foodSearchItem[]) => {
        const existingFoodSelections = [...previousFoodSelections];
        existingFoodSelections.push(foodSearchItem);
        return existingFoodSelections;
      });
    }
  };

  const removeFoodSelection = async (tagID: string) => {
    setDidChangeOccur(true)
    setFoodSelections((previousFoodSelections: foodSearchItem[]) => {
      const existingFoodSelections = previousFoodSelections.filter(
        (foodItem: foodSearchItem) => foodItem.tag_id !== tagID
      );
      return existingFoodSelections;
    });
  };

  const clearFoodSelections = async () => {
    setDidChangeOccur(true)
    setFoodSelections([]);
  };

  useEffect(() => {
    console.log("useEffect: " + calculationResults);
  }, [calculationResults]);

  return (
    <div>
      Welcome to Food Tracker! With this you can track your calories and other
      statistics with the help of the Nutrionix API. You do not need to sign in
      to make selections and calculations. The site will remember your
      selections from your last visit even! However, to save your selections
      into a meal, you will need to sign in. Please note that your saved meal
      plans will be public so we can share super, healthy or even super healthy
      meals with all users.
      <SearchContainerComponent
        input={input}
        onChange={onSearchBarTextChange}
        onSearchBarClear={onSearchBarClear}
      />
      <Container fluid>
        <ContentContainerComponent
          searchResultError={searchResultError}
          results={searchResults}
          query={input}
          MAX_SELECTIONS_LENGTH={MAX_SELECTIONS_LENGTH}
          foodSelections={foodSelections}
          selectionsStats={calculationResults}
          onAddFoodSelectionClick={addFoodSelection}
          onRemoveFoodSelectionClick={removeFoodSelection}
          onClearFoodSelectionClick={clearFoodSelections}
          user={loggedInUser}
        />
      </Container>
      <CalculationComponent 
        calculateStats={calculateStats}
        incrementValues={incrementValues} 
        calculationResults={calculationResults} 
        totalsArray={totals} 
        didChangeOccur={didChangeOccur}/>
    </div>
  );
};

export default HomePage;
