import { useState } from "react";
import { foodSearchItem } from "../models/foodSearchItem";
import placeholder from "../resources/placeholder.jpeg";
import styles from "../styles/FoodSearch.module.css";
const INVALID_FOOD_IMAGE = "N/A";

interface IProps {
  tagID: string;
  foodItem: foodSearchItem;
  // The button configuration for moving food items into the cart
  buttonConfig: {
    disabled: boolean,
    className: string;
    title: string;
    onClick: (imdbID: string) => void;
  };
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
};

const FoodItemComponent = (props: IProps) => {
  // Initially the value was being read as a string and thus could not be incremented
  // Also we save the initial value separately as that will be how food servings will be measured
  // much like how nutrition facts don't measure by per "1 macaroni noodle" but rather a cup of noodles
  const initialQuantity = props.foodItem.serving_qty.valueOf();
  const [quantityCount, setQuantityCount] = useState(initialQuantity);
  // This fetch may be prone to error
  const foodPhoto: string = props.foodItem.photo["thumb"];

  const onClick = () => {
    props.buttonConfig.onClick(props.tagID);
  };

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
        <div className={styles.FoodSearchItemTitle}>
          {/* Below is how we handle the input for quantity */}
          <label>Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantityCount}
            min={quantityCount}
            max="100"
            step={initialQuantity}
            onChange={(e) => setQuantityCount(e.target.value)}
          />
        </div>
        <button 
        className={props.buttonConfig.className} 
        onClick={onClick}
        disabled={props.buttonConfig.disabled}
        >
          {props.buttonConfig.title}
        </button>
      </div>
    </div>
  );
};

export default FoodItemComponent;
