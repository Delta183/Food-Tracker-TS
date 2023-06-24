import { foodSearchItem } from "../../models/foodSearchItem";
import SearchResultComponent from "./SearchResultComponent";
import styles from "../../styles/FoodSearch.module.css";
import findFoodByTagID from "../../utils/foodItem_array_helpers";

interface IProps {
  results: foodSearchItem[]; // the array that will return from the search
  query: string;
  searchResultError: Error | null;
  foodSelections: foodSearchItem[];
  onAddFoodSelectionClick: (imdbID: string) => void;
}

const isTooManyResultsError = (error: Error | null): boolean => {
  if (error === null) {
    return false;
  }
  const errorMessage = error.message;
  return errorMessage === "Too many results.";
};

// In the case there aren't excessive amount of results but the results are null, then raise
// false as a flag for results
const shouldShowNoResultsPlaceholder = (props: IProps): boolean => {
  return (
    !isTooManyResultsError(props.searchResultError) &&
    props.results.length === 0 &&
    props.query.length > 0
  );
};

const SearchResultListComponent = (props: IProps) => {
  return (
    <div className={styles.contentListContainer}>
      <div className={styles.contentListHeader}>
        {props.query === null || props.query.length === 0
          ? "Results"
          : `Results for "${props.query}"`}
      </div>
      {isTooManyResultsError(props.searchResultError) ? (
        <div className={styles.searchResultsPlaceholderLabel}>
          Too many results were returned, please make your query more specific.
        </div>
      ) : null}
      {shouldShowNoResultsPlaceholder(props) ? (
        <div className={styles.searchResultsPlaceholderLabel}>
          No results found. Please try another query.
        </div>
      ) : null}
      {props.results.map((result) => {
        // This part calls on the SearchResultComponent which are all the titles
        return (
          <SearchResultComponent
            isSelected={
              findFoodByTagID(result.tag_id, props.foodSelections) !== null
            }
            key={result.tag_id}
            tagID={result.tag_id}
            result={result}
            onAddFoodSelectionClick={props.onAddFoodSelectionClick}
          />
        );
      })}
    </div>
  );
};

export default SearchResultListComponent;
