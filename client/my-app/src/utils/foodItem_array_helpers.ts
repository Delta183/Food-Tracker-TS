import { foodSearchItem } from "../models/foodSearchItem";

// Function to find if a food exists in a given list, mainly to be used to see if a search
// result is already among the selections.
const findFoodByTagID = (
  tagID: string,
  foodSearchResults: foodSearchItem[]
): foodSearchItem | null => {
  for (var i = 0; i < foodSearchResults.length; i++) {
    const foodSearchItem = foodSearchResults[i];
    if (foodSearchItem.tag_id === tagID) {
      return foodSearchItem;
    }
  }
  return null;
};

export default findFoodByTagID;
