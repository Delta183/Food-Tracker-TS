import { foodSearchItem } from "../models/foodSearchItem";
import styles from "../styles/FoodSearch.module.css";

interface IProps {
  tagID: string;
  foodItem: foodSearchItem;
}

const FoodItemDisplayComponent = (props: IProps) => {
  // Initially the value was being read as a string and thus could not be incremented
  // Also we save the initial value separately as that will be how food servings will be measured
  // much like how nutrition facts don't measure by per "1 macaroni noodle" but rather a cup of noodles
  const currentQuantity = props.foodItem.quantity;
  // This fetch may be prone to error
  // const foodPhoto: string = props.foodItem.photo["thumb"];

  return (
    <div className={styles.FoodSearchItemContainer}>
      <div className={styles.foodSearchItemButtonColumn}>
        <div className={styles.FoodSearchItemTitle}>
          {`${props.foodItem.food_name}`}
        </div>
      
        <div className={styles.FoodSearchItemUnit}>
          {`Unit: ${props.foodItem.serving_unit}`}
        </div>
        
      </div>
      <div className={styles.foodSearchItemButtonColumn}>
        <div className={styles.FoodSearchItemTitle}>
          {/* Below is how we handle the input for quantity */}
          <div>Quantity: {currentQuantity}</div>
        </div>
      </div>
    </div>
  );
};

export default FoodItemDisplayComponent;
