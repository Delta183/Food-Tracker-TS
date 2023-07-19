import { foodSearchItem } from "../models/foodSearchItem";
import styles from "../styles/FoodSearch.module.css";
import placeholder from "../resources/placeholder.jpeg";

const INVALID_FOOD_IMAGE = "N/A";

interface IProps {
  tagID: string;
  foodItem: foodSearchItem;
}
const classNameForPosterStatus = (hasPoster: boolean): string => {
  return hasPoster
    ? `${styles.foodItemImage}`
    : `${styles.foodItemPlaceholderImage}`;
};

const altTextForPosterStatus = (
  hasPoster: boolean,
  foodItem: foodSearchItem
): string => {
  if (hasPoster) {
    return `Image for ${foodItem.food_name}`;
  } else {
    return `Image not found, showing placeholder for ${foodItem.food_name}`;
  }
}
const FoodItemDisplayComponent = (props: IProps) => {
  // TODO: Revise the photo retrieval to be safer
  const foodPhoto: string = props.foodItem.photo["thumb"];
  // Initially the value was being read as a string and thus could not be incremented
  // Also we save the initial value separately as that will be how food servings will be measured
  // much like how nutrition facts don't measure by per "1 macaroni noodle" but rather a cup of noodles
  const currentQuantity = props.foodItem.quantity;
  // This fetch may be prone to error
  // const foodPhoto: string = props.foodItem.photo["thumb"];
  const hasPoster = foodPhoto !== INVALID_FOOD_IMAGE;

  return (
    <div className={styles.FoodSearchItemContainer}>
        <img
        className={classNameForPosterStatus(hasPoster)}
        src={hasPoster ? foodPhoto : placeholder}
        alt={altTextForPosterStatus(hasPoster, props.foodItem)}
      />
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
