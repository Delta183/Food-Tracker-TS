import SearchBarComponent from "./SearchBarComponent";
import styles from "../../styles/FoodSearch.module.css";

// The IProps again being what is sent over by the parent components
// These will be sent further down to the child component of SearchBarComponent
interface IProps {
  input: string;
  onChange: (text: string) => void;
  onSearchBarClear: () => void;
}

// The parent component for all components related to searching
const SearchContainerComponent = ({
  input,
  onChange,
  onSearchBarClear,
}: IProps) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchTitleLabel}>
        Select and add foods to your list to get the meaty statistics!
      </div>
      <div className={styles.searchTitleLabel}>
        The calculations are found at the bottom of the page.
      </div>
      <div className={styles.searchTitleLabel}>
        You can manually input the amount and can also save selections as a
        meal.
      </div>
      <div className={styles.searchTitleLabel}>
        Use the searchbar below to find a food or drink:{" "}
      </div>
      <SearchBarComponent
        input={input}
        onChange={onChange}
        onSearchBarClear={onSearchBarClear}
      />
    </div>
  );
};

export default SearchContainerComponent;
