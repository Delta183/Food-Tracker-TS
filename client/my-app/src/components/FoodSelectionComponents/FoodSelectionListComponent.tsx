import { foodSearchItem } from "../../models/foodSearchItem";
import FoodSelectionComponent from "./FoodSelectionComponent";
import styles from "../../styles/FoodSearch.module.css";
import { Button } from "react-bootstrap";
import { Meal as MealModel } from "../../models/meal";
import AddEditMealDialog from "../MealsPageComponents/AddEditMealDialog";
import { useState } from "react";
import { User } from "../../models/user";

interface IProps {
  user: User | null;
  foodSelections: foodSearchItem[]; // The list of selections
  MAX_SELECTIONS_LENGTH: number;
  onRemoveFoodSelectionClick: (imdbID: string) => void;
}

const FoodSelectionsListComponent = (props: IProps) => {
  const [showAddMealDialog, setShowAddMealDialog] = useState(false);
  const [meals, setMeals] = useState<MealModel[]>([]);


// Pressing the button to save the selection as a meal will take the user to another page with a form
const saveAsMeal = () => {
  // toggle a boolean to make a modal appear
  setShowAddMealDialog(true)
}

  let banner = <div></div>;
  if (props.foodSelections.length >= props.MAX_SELECTIONS_LENGTH) {
    banner = (
      <div className="nomination-banner">
        You have successfully added {props.MAX_SELECTIONS_LENGTH} food items!
        {/* <img src={checkmark} alt="checkmark" height="36px" width="36px"/> */}
      </div>
    );
  } else {
    banner = <div></div>;
  }
  return (
    <div className={styles.contentListContainer}>
      <div className={styles.contentListHeader}>Food Selections</div>
      {banner}
      {props.foodSelections.map((selection) => {
        return (
          <FoodSelectionComponent
            key={selection.tag_id}
            tagID={selection.tag_id}
            foodSelection={selection}
            onRemoveFoodSelectionClick={props.onRemoveFoodSelectionClick}
          />
        );
      })}
      {/* Logic here being that 1 item in a meal isn't enough to be archived into a meal and can be abused more easily */}
      {/* Also user must be signed in for this to work */}
      {/* Also this should only allow someone who is logged in to save a meal */}
      <div className={styles.selectionButton}>
      {props.foodSelections.length > 1 && props.user != null ? (
        <Button variant="primary" onClick={saveAsMeal}>Save as Meal</Button>
      ) : (
        <div>To save these as a meal, you must log in</div>
      )}
      </div>
       {showAddMealDialog && (
        <AddEditMealDialog
          onDismiss={() => setShowAddMealDialog(false)}
          onMealSaved={(newMeal) => {
            // Creates a new array, adds the notes that exist currently in which we will add the newest one afterwards
            setMeals([...meals, newMeal]);
            // Be sure to close the dialog as well
            setShowAddMealDialog(false);
          }}
          foodSelections={props.foodSelections}
          user={props.user?.username}
        />
      )}
    </div>
  );
};

export default FoodSelectionsListComponent;
