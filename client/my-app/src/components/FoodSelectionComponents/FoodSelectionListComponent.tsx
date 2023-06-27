import { foodSearchItem } from "../../models/foodSearchItem";
import FoodSelectionComponent from "./FoodSelectionComponent";
import styles from "../../styles/FoodSearch.module.css";
import { Button } from "react-bootstrap";

interface IProps {
  foodSelections: foodSearchItem[]; // The list of selections
  MAX_SELECTIONS_LENGTH: number;
  onRemoveFoodSelectionClick: (imdbID: string) => void;
}

const FoodSelectionsListComponent = (props: IProps) => {
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
      {props.foodSelections.length > 1 ? <Button
          variant="success"
        >
         Save as Meal
        </Button> : <></>
        }
    </div>
  );
};

export default FoodSelectionsListComponent;
