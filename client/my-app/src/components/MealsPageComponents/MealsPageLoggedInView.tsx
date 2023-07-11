/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Meal as MealModel } from "../../models/meal";
import * as MealsApi from "../../network/meals.api";
import styles from "../../styles/NotesPage.module.css";
import Meal from "./Meals"
import { foodSearchItem } from "../../models/foodSearchItem";


const MealsPageLoggedInView = () => {
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
     
    </>
  );
};

export default MealsPageLoggedInView;
