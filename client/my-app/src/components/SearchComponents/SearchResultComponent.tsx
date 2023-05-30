import { foodSearchItem } from "../../models/foodSearchItem"
import FoodItemComponent from "../FoodItemComponent"

interface IProps {
  key: string;
  tagID: string;
  result: foodSearchItem;
//   isNominated: boolean;
//   onAddNominationClick: (imdbID: string) => void;
}

const SearchResultComponent = (props: IProps) => {
  return (
    <FoodItemComponent
      tagID={props.tagID}
      foodItem={props.result}
    //   buttonConfig={{
    //     disabled: props.isNominated,
    //     className: "base-button nominate-button",
    //     title: "Nominate",
    //     onClick: props.onAddNominationClick,
    //   }}
    />
  );
};

export default SearchResultComponent;