import { Button } from "react-bootstrap";
import styles from "../../styles/FoodSearch.module.css";

interface IProps {
  input: string; // Tracking the input in a string
  onChange: (text: string) => void; // Tracking the changes of the text in this function
  onSearchBarClear: () => void;
}

// Consistent with all sub components of the like, be sure to include the IProps within the header
const SearchBarComponent = ({ input, onChange, onSearchBarClear }: IProps) => {
  return (
    <div className={styles.searchBarRow}>
      <input
        className={styles.searchBar}
        value={input} // Be sure that this matches the value in the IProps
        placeholder={"e.g. Pizza, Chicken"}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button variant="primary" onClick={onSearchBarClear}>
        Clear
      </Button>
    </div>
  );
};

export default SearchBarComponent;
