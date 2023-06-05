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
      buttonConfig={{
        disabled: props.isSelected,
        className: "base-button nominate-button",
        title: "Select",
        onClick: props.onAddFoodSelectionClick,
      }}
    />
  );
};

export default SearchResultComponent;
