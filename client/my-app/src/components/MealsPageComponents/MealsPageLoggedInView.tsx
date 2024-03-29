/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { Meal as MealModel } from "../../models/meal";
import * as MealsApi from "../../network/meals.api";
import styles from "../../styles/MealsPage.module.css";
import Meal from "./Meals";
import { User } from "../../models/user";

interface MealsPageProps {
  loggedInUser: User | null;
}

const MealsPageLoggedInView = ({ loggedInUser }: MealsPageProps) => {
  // React needs a special type of variable for updated value
  // Using <> allows us to declare the type of the react variables
  const [meals, setMeals] = useState<MealModel[]>([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  // Making an error type specifically for the meals
  const [showMealsLoadingError, setShowMealsLoadingError] = useState(true);

  useEffect(() => {
    // Await functions need to be async
    async function loadMeals() {
      try {
        setShowMealsLoadingError(false);
        setMealsLoading(true);
        // Anything under the function header is run on every render, useEffect allows it to be done once
        const meals = await MealsApi.fetchMeals();
        setMeals(meals);
        // Below is a check for if the id is truly unique
      } catch (error) {
        console.error(error);
        // As this is the fail state for loading meals, our custom error type is set
        setShowMealsLoadingError(true);
      } finally {
        // Finally is called whether of note an error occurs.
        setMealsLoading(false);
      }
    }
    // Call the functions afterwards
    loadMeals();
  }, []); // passing the empty array allows this to run only one time

  // The grid of meals to be outputted in a row by column format
  const mealsGrid = (
    <Row xs={1} md={1} xl={2} className={`g-4 ${styles.mealsGrid}`}>
      {/* .map allows us to use our array of elements for something */}
      {meals.map((meal) => (
        <Col key={meal._id}>
          <Meal meal={meal} />
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      {/* There will be no means of adding one on this page */}
      {mealsLoading && <Spinner animation="border" variant="primary" />}
      {/* Contingency if meals don't load */}
      {showMealsLoadingError && (
        <p>Something went wrong. Please refresh the page</p>
      )}
      {/* Once loading completes, and there is no error, then we must have vaid meals */}
      {!mealsLoading && !showMealsLoadingError && (
        <>
          {/* The empty tages makes for a fragment, allows us to put more than one component */}
          {meals.length > 0 ? mealsGrid : <p>You don't have any meals yet</p>}
        </>
      )}
    </>
  );
};

export default MealsPageLoggedInView;
