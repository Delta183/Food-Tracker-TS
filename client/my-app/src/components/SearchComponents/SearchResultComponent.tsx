import { foodSearchItem } from "../../models/foodSearchItem";
import FoodItemComponent from "../FoodItemComponent";

interface IProps {
  key: string;
  tagID: string;
  result: foodSearchItem;
  isSelected: boolean;
  onAddFoodSelectionClick: (tagID: string) => void;
}

const SearchResultComponent = (props: IProps) => {
  return (
    <FoodItemComponent
      tagID={props.tagID}
      foodItem={props.result}
      // Since we reuse the button for this and selections, we send a set of configs
      buttonConfig={{
        disabled: props.isSelected,
        className: "primary",
        title: "Select",
        onClick: props.onAddFoodSelectionClick, // for the results, we are able to add them to the selections
      }}
    />
  );
};

export default SearchResultComponent;
