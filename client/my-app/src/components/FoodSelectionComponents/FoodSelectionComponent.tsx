import { foodSearchItem } from "../../models/foodSearchItem";
import FoodItemComponent from "../FoodItemComponent";

interface IProps {
  key: string; // Given that these will be on two lists and modified, id must be tracked
  tagID: string; // id of each food item per the API of Nutritionix
  foodSelection: foodSearchItem; // the selected food item from the list
  onRemoveFoodSelectionClick: (tagID: string) => void;
}

const FoodSelectionComponent = (props: IProps) => {
  return (
    // Use the same component as we need the exact same information but only changing the button
    <FoodItemComponent
      tagID={props.tagID}
      foodItem={props.foodSelection}
      buttonConfig={{
        disabled: false,
        className: "danger",
        title: "Remove", // Hardcoded remove as selected foods can only be removed
        onClick: props.onRemoveFoodSelectionClick, // Additonally replacing the accompanying function with that
      }}
    />
  );
};

export default FoodSelectionComponent;
