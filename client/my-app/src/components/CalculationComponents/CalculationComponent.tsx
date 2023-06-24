import styles from "../../styles/FoodSearch.module.css";

const CalculationComponent = () => {
    return (
      <div className={styles.searchContainer}>
        <div className={styles.searchTitleLabel}>
          Select and add foods to your list to get the meaty statistics!
        </div>
        <div className={styles.searchTitleLabel}>
          Use the searchbar below to find a food or drink:{" "}
        </div>
      </div>
    );
  };
  
  export default CalculationComponent;