import { foodStatsItem } from "../models/foodStatsItem";

const findFoodStatsByTagID = (
  tagID: string,
  foodStatItems: foodStatsItem[]
): foodStatsItem | null => {
  for (var i = 0; i < foodStatItems.length; i++) {
    const foodStatItem = foodStatItems[i];
    // Issue that arose here was a potential string and int mismatch with triple =, hence the below
    // eslint-disable-next-line eqeqeq
    if (foodStatItem.tags["tag_id"] == tagID) {
      return foodStatItem;
    }
  }
  return null;
};

export default findFoodStatsByTagID;
