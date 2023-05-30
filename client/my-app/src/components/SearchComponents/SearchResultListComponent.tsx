import { foodSearchItem } from "../../models/foodSearchItem"
import SearchResultComponent from "./SearchResultComponent";

interface IProps {
  results: foodSearchItem[]; // the array that will return from the search
  query: string; 
  searchResultError: Error | null;
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
    <div className={"content-list-container"}>
      <div className={"content-list-header"}>
        {props.query === null || props.query.length === 0
          ? "Results"
          : `Results for "${props.query}"`}
      </div>
      {isTooManyResultsError(props.searchResultError) ? (
        <div className={"search-results-placeholder-label"}>
          Too many results were returned, please make your query more specific.
        </div>
      ) : null}
      {shouldShowNoResultsPlaceholder(props) ? (
        <div className={"search-results-placeholder-label"}>
          No results found. Please try another query.
        </div>
      ) : null}
      {props.results.map((result) => {
        // This part calls on the SearchResultComponent which are all the titles
        return (
          <SearchResultComponent
            key={result.tag_id}
            tagID={result.tag_id}
            result={result}
            // onAddNominationClick={props.onAddNominationClick}
          />
        );
      })}
    </div>
  );
};

export default SearchResultListComponent;