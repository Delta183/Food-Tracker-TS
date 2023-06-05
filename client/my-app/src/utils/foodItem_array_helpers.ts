import { foodSearchItem } from "../models/foodSearchItem";

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
