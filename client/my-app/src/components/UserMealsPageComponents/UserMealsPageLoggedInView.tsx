/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {Col, Row, Spinner } from "react-bootstrap";
import { Meal as MealModel } from "../../models/meal";
import * as MealsApi from "../../network/meals.api";
import styles from "../../styles/MealsPage.module.css";
import Meals from "../MealsPageComponents/Meals";
import { User } from "../../models/user";

interface MealsPageProps {
  loggedInUser: User | null;
}

const UserMealsPageLoggedInView = ({ loggedInUser }: MealsPageProps) => {
  // React needs a special type of variable for updated value
  // Using <> allows us to declare the type of the react variables
  const [meals, setMeals] = useState<MealModel[]>([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  // Making an error type specifically for the notes
  const [showMealsLoadingError, setShowMealsLoadingError] = useState(true);
  // TODO: Change this for the sending to the edit page

  useEffect(() => {
    // Await functions need to be async
    async function loadMeals() {
      try {
        setShowMealsLoadingError(false);
        setMealsLoading(true);
        // Anything under the function header is run on every render, useEffect allows it to be done once
        const meals = await MealsApi.fetchUserMeals();
        setMeals(meals);
        // Below is a check for if the id is truly unique
        // meals.forEach((meal) => {
        //   console.log(meal._id)
        // });
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
    loadMeals();
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
    <Row xs={1} md={1} xl={2} className={`g-4 ${styles.notesGrid}`}>
      {/* .map allows us to use our array of elements for something */}
      {meals.map((meal) => (
        <Col key={meal._id}>
          <Meals meal={meal} onDeleteMealClicked={deleteNote} />
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
          {meals.length > 0 ? mealsGrid : <p>You don't have any meals yet</p>}
        </>
      )}
    </>
  );
};

export default UserMealsPageLoggedInView;
