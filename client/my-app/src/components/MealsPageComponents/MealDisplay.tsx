/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import styles from "../../styles/MealDisplay.module.css";
import { User } from "../../models/user";
import { useNavigate, useParams } from "react-router-dom";
import { Meal as MealModel } from "../../models/meal";
import * as MealsApi from "../../network/meals.api";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { MealInput } from "../../network/meals.api";
import { foodSearchItem } from "../../models/foodSearchItem";
import { foodStatsItem } from "../../models/foodStatsItem";
import totalsTemplate from "../../utils/totalsTemplate";
import {
  calculateStatistics,
  searchFoodsWithQuery,
} from "../../network/nutritionix_api";
import debounce from "../../utils/debounce";
import Swal from "sweetalert2";
import findFoodByTagID from "../../utils/foodItem_array_helpers";
import findFoodStatsByTagID from "../../utils/foodStats_array_helpers";
import ContentContainerComponent from "../ContentContainerComponent";
import SearchBarComponent from "../SearchComponents/SearchBarComponent";
import mealInputTemplate from "../../utils/mealInputTemplate";
import CalculationComponent from "../CalculationComponents/CalculationComponent";
import emptyStateLogo from "../../resources/healthy-food-calories-calculator.png";
import {
  incrementValue,
  decrementValue,
  resetValues,
} from "../../utils/totals_array_helper";

interface MealsPageProps {
  loggedInUser: User | null;
}
const DEBOUNCE_DURATION = 500;
const MAX_SELECTIONS_LENGTH = 50; // There has to be a limit to the foods selected

// IMPORTANT: This page does do a lot for a subcomponent, identical to HomePage
// Yet it needs to be able to do everything said page can for the sake of edits.

const MealDisplay = ({ loggedInUser }: MealsPageProps) => {
  const navigate = useNavigate();

  // Meal States
  const [meal, setMeal] = useState<MealModel>();
  const [selections, setSelections] = useState(Array<foodSearchItem>());
  const [editedMeal] = useState<MealInput>(mealInputTemplate);
  const [mealLoading, setMealLoading] = useState(true);
  const [showMealLoadingError, setShowMealLoadingError] = useState(true);
  const { mealId } = useParams(); // Use this to get the element of the given name in the url

  // Edit States
  const [isEditMode, setIsEditMode] = useState(false);
  const [editMealTitle, setEditMealTitle] = useState("");
  const [editMealText, setEditMealText] = useState("");
  const [editMealSelections, setEditMealSelections] = useState(
    Array<foodSearchItem>()
  );
  const [editMealStats, setEditMealStats] = useState(Array<foodStatsItem>());
  const [editMealTotals, setEditMealTotals] = useState(totalsTemplate);

  // Search States
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState(Array<foodSearchItem>());
  const [searchResultError, setSearchResultError] = useState<Error | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [calculationResultError, setCalculationResultError] =
    useState<Error | null>(null);

  // In this particular case meals/:mealId had 'mealId' as the variable we wanted.
  // Use the function in the api class to get a json response in an array and use the states to set it
  const performCalculation = async (foodItem: foodSearchItem) => {
    var query = `${foodItem.quantity} ${foodItem.food_name}, `;
    const results = await calculateStatistics(query);
    // A function like this is able to maintain its results and errors and be set within its body
      setEditMealStats((previousFoodStats: foodStatsItem[]) => {
        const existingFoodStats = [...previousFoodStats];
        existingFoodStats.push(results);
        return existingFoodStats;
      }); // The local storage one
      setEditMealTotals(incrementValue(results, editMealTotals));
      // incrementValues(results);
    };


  // Use the function in the api class to get a json response in an array and use the states to set it
  const performSearch = async (query: string) => {
    // A function like this is able to maintain its results and errors and be set within its body
    setSearchResults(await searchFoodsWithQuery(query));
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
    if (editMealSelections.length >= MAX_SELECTIONS_LENGTH) {
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
      setEditMealSelections((previousFoodSelections: foodSearchItem[]) => {
        const existingFoodSelections = [...previousFoodSelections];
        existingFoodSelections.push(foodSearchItem);
        return existingFoodSelections;
      });
      performCalculation(foodSearchItem);
    }
  };

  const removeFoodSelection = async (tagID: string) => {
    setEditMealSelections((previousFoodSelections: foodSearchItem[]) => {
      const existingFoodSelections = previousFoodSelections.filter(
        (foodItem: foodSearchItem) => foodItem.tag_id !== tagID
      );
      return existingFoodSelections;
    });

    // Fetch the selected item in particular from the Nutritionix API endpoints
    const foodSearchItem = findFoodStatsByTagID(tagID, editMealStats);
    // Decrement the value from the totals
    setEditMealTotals(decrementValue(foodSearchItem, editMealTotals));

    // Prior to removal, decrement the foodStatItem from the totals
    setEditMealStats((previousFoodStats: foodStatsItem[]) => {
      const existingFoodStats = previousFoodStats.filter(
        // eslint-disable-next-line eqeqeq
        (foodStat: foodStatsItem) => foodStat.tags["tag_id"] != tagID
      );
      return existingFoodStats;
    });
  };

  // This will be called on the clear button press; Hence set all selections and calculations to empty
  const clearFoodSelections = async () => {
    setEditMealSelections([]);
    setEditMealStats([]);
    setEditMealTotals(resetValues(editMealTotals));
  };

  // For when the user elects to cancel the edit, set the edit values to their default
  const cancelEdit = () => {
    if (meal !== undefined) {
      setEditMealTitle(meal.title);
      setEditMealText(meal.text || "");
      setEditMealSelections(meal.selections);
      setEditMealStats(meal.selectionsStats);
      setEditMealTotals(meal.totalsArray);
      setIsEditMode(false);
      refreshPage();
    }
  };

  function refreshPage() {
    window.location.reload();
  }

  // These functions had to exist for the separate title and text element on the form
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditMealTitle(e.target.value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditMealText(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editedMeal != null) {
        // Construct the meal using the newly set states 
        editedMeal.title = editMealTitle;
        editedMeal.text = editMealText;
        // Be sure to set as it isn't by default and this will otherwise be a means to update new choices
        editedMeal.selections = editMealSelections;
        editedMeal.username = loggedInUser?.username;
        // Presumably here is where the calculations will be saved and put into the meals object
        editedMeal.selectionsStats = editMealStats;
        editedMeal.totalsArray = editMealTotals;
        if (meal != null) {
          await MealsApi.updateMeal(meal._id, editedMeal);
        }
      }
      // Afterwards go to main page
      setIsEditMode(false);
      // Refresh such that the states are reset
      refreshPage(); 
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  // The call for the API to the meal deletion endpoint
  const deleteMeal = async (mealId: string | undefined) => {
    if (mealId != undefined) {
      try {
        await MealsApi.deleteMeal(mealId);
        // After one is deleted, the user should not remain on that page.
        navigate("/meals");
      } catch (error) {
        console.error(error);
        // As this is the fail state for loading meals, our custom error type is set
        setShowMealLoadingError(true);
      }
    }
  };

  useEffect(() => {
    // Await functions need to be async
    async function loadMeal() {
      try {
        setShowMealLoadingError(false);
        setMealLoading(true);
        // Anything under the function header is run on every render, useEffect allows it to be done once
        const meal = await MealsApi.fetchMeal(mealId);
        // This has to be done here as we get to this page via a link and as such, cannot pass the meal down
        setMeal(meal);
        setEditMealTitle(meal.title);
        setEditMealText(meal.text || "");
        setEditMealSelections(meal.selections);
        setEditMealStats(meal.selectionsStats);
        setEditMealTotals(meal.totalsArray);
        setSelections(meal.selections);
      } catch (error) {
        console.error(error);
        // As this is the fail state for loading meals, our custom error type is set
        setShowMealLoadingError(true);
      } finally {
        // Finally is called whether or not an error occurs.
        setMealLoading(false);
      }
    }
    // Call the functions afterwards
    loadMeal();
  }, [mealId]); // passing the empty array allows this to run only one time

  return (
    <div>
      {/* Main View */}
      {isEditMode === false ? (
        <>
          {/* There will be no means of adding one on this page */}
          {mealLoading && <Spinner animation="border" variant="primary" />}
          {/* Contingency if meals don't load */}
          {showMealLoadingError && (
            <p>Something went wrong. Please refresh the page</p>
          )}
          {/* Once loading completes, and there is no error, then we must have a valid meal */}
          {!mealLoading && !showMealLoadingError && (
            <>
              <div className={styles.selectionsColumn}>
                {/* This may not be advisable to have these two attributes on client side */}
                {meal?.userId === loggedInUser?._id ? (
                  <>
                    <div className={styles.selectionButton}>
                      <Button
                        size="lg"
                        variant="primary"
                        onClick={() => setIsEditMode(true)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="lg"
                        variant="danger"
                        onClick={() => deleteMeal(meal?._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Otherwise the buttons should not appear if the user is not the owner */}
                  </>
                )}
                <div className={styles.selectionTitle}>
                  <h1>
                    {" "}
                    {meal?.title} by {meal?.username}
                  </h1>
                </div>
                <div className={styles.selectionDesc}>
                  <h4>{meal?.text}</h4>
                </div>
                {selections.length > 0 ? (
                  <>
                    <div className={styles.selectionsRow}>
                      {/* Check meal selections if >0, otherwise an empty state and omit all other components */}
                      {selections.map((selection) => {
                        return (
                          <div
                            className={styles.selectionsRowSingle}
                            key={selection.tag_id}
                          >
                            <div className={styles.selectionsColumn}>
                              <div className={styles.selectionText}>
                                {selection.food_name}
                              </div>
                              <img
                                alt="foodImage"
                                className={styles.selectionItemImage}
                                src={selection.photo["thumb"]}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.statsRow}>
                      <CalculationComponent
                        calculationResults={meal?.selectionsStats}
                        totalsArray={meal?.totalsArray}
                      />
                    </div>
                  </>
                ) : (
                  // Below is the empty state
                  <div className={styles.selectionDesc}>
                    <div className={styles.emptyStateImage}>
                      <img src={emptyStateLogo} alt="emptyStateLogo" />
                    </div>
                    <h4>
                      Feel free to edit and make more selections to this meal!
                      Its looking a little lonely
                    </h4>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        // Below is the editing half of the page
        <>
          <div className={styles.selectionsColumn}>
            <div className={styles.selectionButton}>
              <Button size="lg" variant="primary" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
            <div className={styles.selectionTitle}>
              <h1>
                Now Editing: {meal?.title} by {meal?.username}
              </h1>
            </div>

            {/* Forms below */}
            <Form id="editMealForm" onSubmit={handleSubmit}>
              <Form.Group className="m-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  value={editMealTitle}
                  onChange={handleTitleChange}
                  required={true}
                  isInvalid={!(editMealTitle.length > 0)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter input for the title.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="m-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  value={editMealText}
                  onChange={handleTextChange}
                />
              </Form.Group>

              {/* Selections below */}
              <div style={{ marginBottom: "12px" }}>
                <SearchBarComponent
                  input={input}
                  onChange={onSearchBarTextChange}
                  onSearchBarClear={onSearchBarClear}
                />
              </div>
              <Container fluid>
                <ContentContainerComponent
                  searchResultError={searchResultError}
                  results={searchResults}
                  query={input}
                  isEditing={true}
                  MAX_SELECTIONS_LENGTH={MAX_SELECTIONS_LENGTH}
                  foodSelections={editMealSelections}
                  selectionsStats={editMealStats}
                  totalsArray={editMealTotals}
                  onAddFoodSelectionClick={addFoodSelection}
                  onRemoveFoodSelectionClick={removeFoodSelection}
                  onClearFoodSelectionClick={clearFoodSelections}
                  user={loggedInUser}
                />
              </Container>
              <CalculationComponent
                calculationResults={editMealStats}
                totalsArray={editMealTotals}
              />
              <div className={styles.selectionsColumn}>
                <Button size="lg" variant="primary" type="submit">
                  Save Edit
                </Button>
              </div>
            </Form>
          </div>
        </>
      )}
    </div>
  );
};

export default MealDisplay;
