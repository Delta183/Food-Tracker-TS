import { foodSearchItem } from "../models/foodSearchItem"
import placeholder from "../resources/placeholder.jpeg"
const INVALID_MOVIE_POSTER_TEXT = "N/A";

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

const altTextForPosterStatus = (hasPoster: boolean, foodItem: foodSearchItem): string => {
  if (hasPoster) {
    return `Image for ${foodItem.food_name}`;
  } else {
    return `Image not found, showing placeholder for ${foodItem.food_name}`;
  }
};

const MovieItemComponent = (props: IProps) => {
//   const onClick = () => {
//     props.buttonConfig.onClick(props.imdbID);
//   };
  // const hasPoster = props.foodItem.photo !== INVALID_MOVIE_POSTER_TEXT;
  return (
    <div className={"movie-item-container"}>
      {/* <img
        className={classNameForPosterStatus(hasPoster)}
        src={hasPoster ? props.foodItem.photo : placeholder}
        alt={altTextForPosterStatus(hasPoster, props.foodItem)}
      /> */}
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

export default MovieItemComponent;