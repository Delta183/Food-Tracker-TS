import { foodSearchItem } from "../../models/foodSearchItem";
import FoodItemComponent from "../FoodItemComponent";

interface IProps {
  key: string;
  tagID: string;
  foodSelection: foodSearchItem;
  onRemoveFoodSelectionClick: (tagID: string) => void;
}

const FoodSelectionComponent = (props: IProps) => {
  return (
    <FoodItemComponent
      tagID={props.tagID}
      foodItem={props.foodSelection}
      buttonConfig={{
        disabled: false,
        className: "base-button remove-button",
        title: "Remove",
        onClick: props.onRemoveFoodSelectionClick,
      }}
    />
  );
};

export default FoodSelectionComponent;
