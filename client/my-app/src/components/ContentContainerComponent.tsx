import { foodSearchItem } from "../models/foodSearchItem";
import SearchResultListComponent from "./SearchComponents/SearchResultListComponent";
import FoodSelectionsListComponent from "./FoodSelectionComponents/FoodSelectionsListComponent";
import styles from "../styles/FoodSearch.module.css";
import { User } from "../models/user";
import { foodStatsItem } from "../models/foodStatsItem";
import { totalsArray } from "../models/totalsArray";

interface IProps {
  user: User | null;
  results: foodSearchItem[];
  foodSelections: foodSearchItem[];
  selectionsStats: foodStatsItem[]
  totalsArray: totalsArray
  MAX_SELECTIONS_LENGTH: number;
  query: string;
  searchResultError: Error | null;
  onAddFoodSelectionClick: (tagID: string) => void;
  onRemoveFoodSelectionClick: (tagID: string) => void;
  onClearFoodSelectionClick: () => void;
}

// The purpose of this component is to maintain the results of the search results and the
// current list of items from the user
const ContentContainerComponent = (props: IProps) => {
  console.log(props.totalsArray)
  return (
    <div className={styles.contentContainer}>
      <SearchResultListComponent
        searchResultError={props.searchResultError}
        results={props.results}
        query={props.query}
        foodSelections={props.foodSelections}
        onAddFoodSelectionClick={props.onAddFoodSelectionClick}
      />
      <FoodSelectionsListComponent
        foodSelections={props.foodSelections}
        selectionsStats={props.selectionsStats}
        totalsArray={props.totalsArray}
        onRemoveFoodSelectionClick={props.onRemoveFoodSelectionClick}
        onClearFoodSelectionClick={props.onClearFoodSelectionClick}
        MAX_SELECTIONS_LENGTH={props.MAX_SELECTIONS_LENGTH}
        user={props.user}
      />
    </div>
  );
};

export default ContentContainerComponent;
