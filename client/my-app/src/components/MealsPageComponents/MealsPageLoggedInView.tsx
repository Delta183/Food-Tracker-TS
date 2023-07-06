/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Meal as MealModel } from "../../models/meal";
import * as MealsApi from "../../network/meals.api";
import styles from "../../styles/NotesPage.module.css";
import stylesUtils from "../../styles/utils.module.css";
import AddEditMealDialog from "./AddEditMealDialog";
import Meal from "./Meals"
import { foodSearchItem } from "../../models/foodSearchItem";

interface IProps {
    selections: foodSearchItem[]
  }

const MealsPageLoggedInView = (props: IProps) => {
  // React needs a special type of variable for updated value
  // Using <> allows us to declare the type of the react variables
  const [meals, setMeals] = useState<MealModel[]>([]);

  const [mealsLoading, setMealsLoading] = useState(true);
  // Making an error type specifically for the notes
  const [showMealsLoadingError, setShowMealsLoadingError] = useState(true);
  const [showAddMealDialog, setShowAddMealDialog] = useState(false);

  const [mealToEdit, setMealToEdit] = useState<MealModel | null>(null);

  useEffect(() => {
    // Await functions need to be async
    async function loadNotes() {
      try {
        setShowMealsLoadingError(false);
        setMealsLoading(true);
        // Anything under the function header is run on every render, useEffect allows it to be done once
        const notes = await MealsApi.fetchMeals();
        setMeals(notes);
      } catch (error) {
        console.error(error);
        // As this is the fail state for loading notes, our custom error type is set
        setShowMealsLoadingError(true);
      } finally {
        // Finally is called whether of note an error occurs.
        setMealsLoading(false);
      }
    }
    // Call the functions afterwards
    loadNotes();
  }, []); // passing the empty array allows this to run only one time

  // Delete Note logic
  async function deleteNote(meal: MealModel) {
    try {
      await MealsApi.deleteMeal(meal._id);
      // Go through each note of the array and only includes them if the id does not match the given one
      // Thus resulting in its removal from the app
      setMeals(meals.filter((existingNote) => existingNote._id !== meal._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const mealsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
      {/* .map allows us to use our array of elements for something */}
      {meals.map((meal) => (
        <Col key={meal._id}>
          <Meal
            meal={meal}
            className={styles.note}
            onMealClicked={setMealToEdit}
            onDeleteMealClicked={deleteNote}
          />
        </Col>
      ))}
    </Row>
  );

  return (
    <>
    {/* There will be no means of adding one on this page */}
      {mealsLoading && <Spinner animation="border" variant="primary" />}
      {/* Contingency if notes don't load */}
      {showMealsLoadingError && (
        <p>Something went wrong. Please refresh the page</p>
      )}
      {/* Once loading completes, and there is no error, then we must have vaid notes */}
      {!mealsLoading && !showMealsLoadingError && (
        <>
          {/* The empty tages makes for a fragment, allows us to put more than one component */}
          {meals.length > 0 ? mealsGrid : <p>You don't have any notes yet</p>}
        </>
      )}
      {/* Will only show whatever appears after && if the variable is true */}
      {/* We could do it by passing the variable in the component but that will keep the component active */}
      {showAddMealDialog && (
        <AddEditMealDialog
          onDismiss={() => setShowAddMealDialog(false)}
          onMealSaved={(newMeal) => {
            // Creates a new array, adds the notes that exist currently in which we will add the newest one afterwards
            setMeals([...meals, newMeal]);
            // Be sure to close the dialog as well
            setShowAddMealDialog(false);
          }}
          foodSelections={props.selections}
        />
      )}
      {/* The update card component that only appears once editing begins */}
      {mealToEdit && (
        <AddEditMealDialog
          mealToEdit={mealToEdit}
          foodSelections={props.selections}
          onDismiss={() => setMealToEdit(null)}
          onMealSaved={(updatedMeal) => {
            // The function needed to map all the notes but ensure the edited one has its new information
            setMeals(
              meals.map((existingMeal) =>
              existingMeal._id === updatedMeal._id
                  ? updatedMeal
                  : existingMeal
              )
            );
            setMealToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default MealsPageLoggedInView;
