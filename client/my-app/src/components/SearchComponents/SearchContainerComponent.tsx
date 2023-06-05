import SearchBarComponent from "./SearchBarComponent";
import styles from "../../styles/FoodSearch.module.css";

// The IProps again being what is sent over by the parent components
// These will be sent further down to the child component of SearchBarComponent
interface IProps {
  input: string;
  onChange: (text: string) => void;
}

const SearchContainerComponent = ({ input, onChange }: IProps) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchTitleLabel}>
        Select and add foods to your list to get the meaty statistics!
      </div>
      <div className={styles.searchTitleLabel}>
        Use the searchbar below to find a food or drink:{" "}
      </div>
      <SearchBarComponent 
      input={input} 
      onChange={onChange} 
      />
    </div>
  );
};

export default SearchContainerComponent;
