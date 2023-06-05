import { foodSearchItem } from "../models/foodSearchItem";
import SearchResultListComponent from "./SearchComponents/SearchResultListComponent";
import FoodSelectionsListComponent from "./FoodSelectionComponents/FoodSelectionListComponent";
import styles from "../styles/FoodSearch.module.css";
interface IProps {
  results: foodSearchItem[];
  foodSelections: foodSearchItem[];
  MAX_SELECTIONS_LENGTH: number;
  query: string;
  searchResultError: Error | null;
  onAddFoodSelectionClick: (tagID: string) => void;
  onRemoveFoodSelectionClick: (tagID: string) => void;
}

// The purpose of this component is to maintain the results of the search results and the
// current list of items from the user
const ContentContainerComponent = (props: IProps) => {
  return (
    <div className={styles.contentContainer}>
      <SearchResultListComponent
        searchResultError={props.searchResultError}
        results={props.results}
        query={props.query}
        foodSelections={props.foodSelections}
        onAddFoodSelectionClick={props.onAddFoodSelectionClick}
      />
      {/* TODO: Add means to add the same item in a convenient manner, maybe check if currently in list */}
      <FoodSelectionsListComponent
        foodSelections={props.foodSelections}
        onRemoveFoodSelectionClick={props.onRemoveFoodSelectionClick}
        MAX_SELECTIONS_LENGTH={props.MAX_SELECTIONS_LENGTH}
      />
    </div>
  );
};

export default ContentContainerComponent;
