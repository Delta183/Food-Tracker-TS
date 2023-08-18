import { foodStatsItem } from "../models/foodStatsItem";
import { totalsArray } from "../models/totalsArray";

export const resetValues = (editMealTotals: totalsArray): totalsArray => {
  const currentTotals = editMealTotals;
  currentTotals.calories = 0;
  currentTotals.totalFat = 0;
  currentTotals.saturatedFat = 0;
  currentTotals.cholesterol = 0;
  currentTotals.sodium = 0;
  currentTotals.totalCarbs = 0;
  currentTotals.fiber = 0;
  currentTotals.sugars = 0;
  currentTotals.protein = 0;
  currentTotals.potassium = 0;
  return currentTotals;
};

// Possible error here with a null value that returns
export const incrementValue = (
  newFood: foodStatsItem,
  editMealTotals: totalsArray
): totalsArray => {
  const currentTotals = editMealTotals;
  currentTotals.calories += newFood.nf_calories;
  currentTotals.totalFat += newFood.nf_total_fat;
  currentTotals.saturatedFat += newFood.nf_saturated_fat;
  currentTotals.cholesterol += newFood.nf_cholesterol;
  currentTotals.sodium += newFood.nf_sodium;
  currentTotals.totalCarbs += newFood.nf_total_carbohydrate;
  currentTotals.fiber += newFood.nf_dietary_fiber;
  currentTotals.sugars += newFood.nf_sugars;
  currentTotals.protein += newFood.nf_protein;
  currentTotals.potassium += newFood.nf_potassium;
  return currentTotals;
};

export const decrementValue = (
  newFood: foodStatsItem | null,
  editMealTotals: totalsArray
): totalsArray => {
  if (newFood !== null) {
    const currentTotals = editMealTotals;
    currentTotals.calories -= newFood.nf_calories;
    currentTotals.totalFat -= newFood.nf_total_fat;
    currentTotals.saturatedFat -= newFood.nf_saturated_fat;
    currentTotals.cholesterol -= newFood.nf_cholesterol;
    currentTotals.sodium -= newFood.nf_sodium;
    currentTotals.totalCarbs -= newFood.nf_total_carbohydrate;
    currentTotals.fiber -= newFood.nf_dietary_fiber;
    currentTotals.sugars -= newFood.nf_sugars;
    currentTotals.protein -= newFood.nf_protein;
    currentTotals.potassium -= newFood.nf_potassium;
    return currentTotals;
  } else {
    console.log("null food found");
    // In that case, just return the totals to be set
    return editMealTotals;
  }
};
