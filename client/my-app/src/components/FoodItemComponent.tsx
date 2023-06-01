import { foodSearchItem } from "../models/foodSearchItem";
import placeholder from "../resources/placeholder.jpeg";
import styles from "../styles/FoodSearch.module.css";
const INVALID_FOOD_IMAGE = "N/A";

interface IProps {
  tagID: string;
  foodItem: foodSearchItem;
  //   buttonConfig: {
  //     disabled: boolean;
  //     className: string;
  //     title: string;
  //     onClick: (imdbID: string) => void;
  //   };
}

const classNameForPosterStatus = (hasPoster: boolean): string => {
  return hasPoster ? "food-item-image" : "movie-item-placeholder-image";
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
  const foodPhoto: string = props.foodItem.photo["thumb"];
  //   const onClick = () => {
  //     props.buttonConfig.onClick(props.imdbID);
  //   };
  const hasPoster = foodPhoto !== INVALID_FOOD_IMAGE;
  return (
    <div className={styles.FoodSearchItem}>
      <img
        className={classNameForPosterStatus(hasPoster)}
        src={hasPoster ? foodPhoto : placeholder}
        alt={altTextForPosterStatus(hasPoster, props.foodItem)}
      />
      <div className={"movie-item-title"}>
        {`${props.foodItem.food_name} (${props.foodItem.serving_qty})`}
      </div>
      {/* <button
        className={props.buttonConfig.className}
        onClick={onClick}
        disabled={props.buttonConfig.disabled}
      >
        {props.buttonConfig.title}
      </button> */}
    </div>
  );
};

export default FoodItemComponent;
