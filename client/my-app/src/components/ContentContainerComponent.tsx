import { foodSearchItem } from "../models/foodSearchItem";
import SearchResultListComponent from "./SearchComponents/SearchResultListComponent";

interface IProps {
  results: foodSearchItem[];
  query: string;
  searchResultError: Error | null;
}

// The purpose of this component is to maintain the results of the search results and the
// current list of items from the user
const ContentContainerComponent = (props: IProps) => {
  return (
    <div className={"content-container"}>
      <SearchResultListComponent
        searchResultError={props.searchResultError}
        results={props.results}
        query={props.query}
      />
    </div>
    // TODO: Add the shopping cart of sorts for the user's selections
  );
};

export default ContentContainerComponent;
