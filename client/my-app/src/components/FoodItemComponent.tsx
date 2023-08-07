import { useEffect, useState } from "react";
import { foodSearchItem } from "../models/foodSearchItem";
import placeholder from "../resources/placeholder.jpeg";
import styles from "../styles/FoodSearch.module.css";
import Button from "react-bootstrap/Button";

const INVALID_FOOD_IMAGE = "N/A";

interface IProps {
  tagID: string;
  foodItem: foodSearchItem;
  // The button configuration for moving food items into the cart and changes based off results or selections
  buttonConfig: {
    disabled: boolean;
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
  const initialQuantity = props.foodItem.serving_qty;
  const currentQuantity = props.foodItem.quantity;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [load, setLoad] = useState(false);
  const [foodPhoto, setFoodPhoto] = useState("");
  const [quantityCount, setQuantityCount] = useState(initialQuantity);
  // This fetch may be prone to error
  // const foodPhoto: string = props.foodItem.photo["thumb"];

  const updateQuantity = (foodItem: foodSearchItem, quantityValue: string) => {
    foodItem.quantity = quantityValue;
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    setLoad(true);
    await setFoodPhoto(props.foodItem.photo["thumb"]);
    setLoad(false);
  }

  const onClick = () => {
    if (quantityCount === "" || quantityCount === null) {
      // In the case of an empty value being entered, default it to 1
      updateQuantity(props.foodItem, "1");
      setQuantityCount("1");
    } else {
      updateQuantity(props.foodItem, quantityCount);
    }
    props.buttonConfig.onClick(props.tagID);
    // Update the state of the quantity count on each click
  };

  const hasPoster = foodPhoto !== INVALID_FOOD_IMAGE;

  return (
    <div className={styles.FoodSearchItemContainer}>
      {/* Image */}
      <img
        className={classNameForPosterStatus(hasPoster)}
        src={hasPoster ? foodPhoto : placeholder}
        alt={altTextForPosterStatus(hasPoster, props.foodItem)}
      />
      {/* Title and unit column */}
      <div className={styles.foodSearchItemButtonColumn}>
        <div className={styles.FoodSearchItemTitle}>
          {`${props.foodItem.food_name}`}
        </div>

        <div className={styles.FoodSearchItemUnit}>
          {`Unit: ${props.foodItem.serving_unit}`}
        </div>
      </div>
      {/* Quantity column */}
      <div className={styles.foodSearchItemButtonColumn}>
        <div className={styles.FoodSearchItemTitle}>
          {/* Below is how we handle the input for quantity */}
          {props.buttonConfig.title === "Remove" ? (
            <div>Quantity: {currentQuantity}</div>
          ) : (
            <div>
              <div>Quantity:</div>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantityCount}
                min={initialQuantity}
                max="1000"
                step={initialQuantity}
                onChange={(e) => setQuantityCount(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        variant={props.buttonConfig.className}
        onClick={onClick}
        disabled={props.buttonConfig.disabled}
      >
        {/* This changes based on which parent sent this component */}
        {props.buttonConfig.title}
      </Button>{" "}
    </div>
  );
};

export default FoodItemComponent;
