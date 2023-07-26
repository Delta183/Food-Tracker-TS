import { useEffect, useState } from "react";
import styles from "../../styles/MealDisplay.module.css";
import { User } from "../../models/user";
import { useParams } from "react-router-dom"
import { Meal as MealModel } from "../../models/meal";
import * as MealsApi from "../../network/meals.api";
import FoodItemDisplayComponent from "../FoodItemDisplayComponent";
import { Spinner } from "react-bootstrap";

interface MealsPageProps {
  loggedInUser: User | null;
}


const MealDisplay = ({ loggedInUser }: MealsPageProps) => {
  const [meal, setMeal] = useState<MealModel>();
  const [mealLoading, setMealLoading] = useState(true);
  // Making an error type specifically for the notes
  const [showMealLoadingError, setShowMealLoadingError] = useState(true);
  const { mealId } = useParams(); // Use this to get the element of the given name in the url
  // In this particular case meals/:mealId had 'mealId' as the variable we wanted.

  useEffect(() => {
    // Await functions need to be async
    async function loadMeal() {
      try {
        setShowMealLoadingError(false);
        setMealLoading(true);
        // Anything under the function header is run on every render, useEffect allows it to be done once
        const meal = await MealsApi.fetchMeal(mealId);
        setMeal(meal);
        // Below is a check for if the id is truly unique
        // meals.forEach((meal) => {
        //   console.log(meal._id)
        // });
      } catch (error) {
        console.error(error);
        // As this is the fail state for loading notes, our custom error type is set
        setShowMealLoadingError(true);
      } finally {
        // Finally is called whether of note an error occurs.
        setMealLoading(false);
      }
    }
    // Call the functions afterwards
    loadMeal();
  }, [mealId]); // passing the empty array allows this to run only one time

  return (
    <div>
       <>
      {/* There will be no means of adding one on this page */}
      {mealLoading && <Spinner animation="border" variant="primary" />}
      {/* Contingency if notes don't load */}
      {showMealLoadingError && (
        <p>Something went wrong. Please refresh the page</p>
      )}
      {/* Once loading completes, and there is no error, then we must have vaid notes */}
      {!mealLoading && !showMealLoadingError && (
        <>
          <h1>{meal?.title} by {meal?.username}</h1>
          <div>{meal?.text}</div>
          <div> id: {mealId} </div>
          {console.log(meal?.selectionsStats)}
          <div className={styles.mealDisplaySelections}>
          {meal?.selections.map((selection) => {
                    return (
                      <FoodItemDisplayComponent
                        tagID={selection.tag_id}
                        foodItem={selection}
                      />
                    );
                  })}
            </div>
          <div>Calculations finally</div>
        </>
      )}
    </>
     
    </div>
  );
};

export default MealDisplay;
