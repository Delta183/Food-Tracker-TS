import { foodSearchItem } from "../models/foodSearchItem";
import { foodStatsItem } from "../models/foodStatsItem";
import LRU from "../utils/LRUCache";
// The REACT_APP part of the variable names allow for env variables
const key = process.env.REACT_APP_NUTRITIONIX_API_KEY || "";
const id = process.env.REACT_APP_NUTRITIONIX_API_ID || "";

// A cache of size 20 for the foodStatsItem
const cache = new LRU<foodStatsItem>(20);

export const searchFoodsWithQuery = async (
  query: string,
  callback: (results: foodSearchItem[], error: Error | null) => void
) => {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    callback([], null);
    return;
  }

  fetch(
    `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(
      trimmedQuery
    )}&branded=false`,
    {
      method: "GET",
      headers: {
        "x-app-key": key,
        "x-app-id": id,
        "Content-Type": "application/json",
        "x-remote-user-id": "0",
      },
    }
  )
    .then((response) => response.json())

    .then((searchResponse) => {
      const errorMessage = searchResponse["Error"];
      if (errorMessage !== null && errorMessage !== undefined) {
        const error = new Error(errorMessage);
        callback([], error);
      } else {
        // In the response, I get two arrays in an array where "common" is the header
        // for the common set of food
        const searchResponseResults: foodSearchItem[] =
          searchResponse["common"];
        // This will filter items with the same ids in the array
        var cleanResults: foodSearchItem[] = searchResponseResults.filter(
          (searchResponseResults, index, self) =>
            index ===
            self.findIndex((t) => t.tag_id === searchResponseResults.tag_id)
        );
        if (Array.isArray(cleanResults)) {
          callback(cleanResults, null);
        } else {
          callback([], null);
        }
      }
    })
    .catch((error) => {
      console.log(`Something went wrong: ${error}`);
      callback([], error);
    });
};

export const calculateStatistics = async (
  query: string,
  callback: (results: foodStatsItem, error: Error | null) => void
) => {
  //Here is where we pull from the cache if possible, however it would just be a single instance
  // we would have to do the caluclations accordingly to the values of the foodStatsItem if the
  // accompanying number is > 1
  // the name of the food is the key, the statsItem is the object
  // cache.clear()
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    callback(null as any, null);
    return;
  }
  const queryArray = trimmedQuery.split(" ");
  const queryNumber = Number(queryArray[0]);
  var queryString: string = "";
  for (let i = 1; i < queryArray.length; i++) {
    queryString += `${queryArray[i]} `; 
  }
  const cacheResult = cache.get(queryString);
 
  // Assuming the item does exist, create a copy of the item for potential multiplying that
  // needs to be done if the number is greater than 1
  if (cacheResult !== undefined){
    console.log("Pulled from cache")
    // If greater than 1, then do the requisite multiplication
    if(queryNumber !== 1){  
      callback(calculateFoodStatsItemGet(cacheResult, queryNumber), null);
      return;
    }
    else{
      callback(cacheResult, null);
      return;
    }
   
  }

  fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
    body: JSON.stringify({ query: `${query}` }),
    method: "POST",
    headers: {
      "x-app-key": key,
      "x-app-id": id,
      "Content-Type": "application/json",
      "x-remote-user-id": "0",
    },
  })
    .then((response) => response.json())

    .then((searchResponse) => {
      const errorMessage = searchResponse["Error"];
      if (errorMessage !== null && errorMessage !== undefined) {
        const error = new Error(errorMessage);
        callback(null as any, error);
      } else {

        // In the response, I get two arrays in an array where "common" is the header
        // for the common set of food
        const searchResponseResults: foodStatsItem = searchResponse["foods"][0];
        const sanitizedResults: foodStatsItem = sanitizeFoodStatsItem(searchResponseResults);
        // console.log(searchResponseResults)
        // Only set this at the base level of 1, if higher then the division must be made
        // If lower, multiplication must be made
        // Only set if the value/foodStatsItem doesn't already exist in the cache
        if (cacheResult === undefined) {
          if (queryNumber >= 1){
            const multiplier = 1 / queryNumber;
            const cacheInput = calculateFoodStatsItemSet(sanitizedResults, multiplier);
            cache.set(queryString, cacheInput);
          }
          else if (queryNumber > 0){
            const cacheInput = calculateFoodStatsItemSet(sanitizedResults, queryNumber);
            cache.set(queryString, cacheInput);
          }
          else{
            const cacheInput = calculateFoodStatsItemSet(sanitizedResults, 0);
            cache.set(queryString, cacheInput);
          }
      }
        // cache.set(queryString, searchResponseResults);
        // TODO: Ensure this is safe in terms of returning a single JSON object
        if ((sanitizedResults) != null) {
          callback(sanitizedResults, null);
        } else {
          callback(null as any, null);
        }
      }
    })
    .catch((error) => {
      console.log(`Something went wrong: ${error}`);
      callback(null as any, error);
    });
};

// Helper functions for modifying elements of the foodStatsItem

const sanitizeFoodStatsItem = (foodStatsItem: foodStatsItem) : foodStatsItem => {
  
  var result = {} as foodStatsItem;
  result.food_name = foodStatsItem.food_name;
  result.nf_calories = (foodStatsItem.nf_calories) || 0;
  result.nf_cholesterol = (foodStatsItem.nf_cholesterol) || 0;
  result.nf_dietary_fiber = (foodStatsItem.nf_dietary_fiber ) || 0;
  result.nf_potassium = (foodStatsItem.nf_potassium ) || 0;
  result.nf_protein = (foodStatsItem.nf_protein ) || 0;
  result.nf_saturated_fat = (foodStatsItem.nf_saturated_fat) || 0;
  result.nf_sodium = (foodStatsItem.nf_sodium ) || 0;
  result.nf_sugars = (foodStatsItem.nf_sugars) || 0;
  result.nf_total_carbohydrate = (foodStatsItem.nf_total_carbohydrate) || 0;
  result.nf_total_fat = (foodStatsItem.nf_total_fat ) || 0;
  result.serving_qty = (foodStatsItem.serving_qty );
  result.serving_unit = foodStatsItem.serving_unit;
  result.tags = foodStatsItem.tags;
  console.log("sanitize")
  console.log(result);
  return result;
  // console.log(result);
}

const calculateFoodStatsItemSet = (foodStatsItem: foodStatsItem, multiplier: number) : foodStatsItem => {
  // Currently nothing changes so the change must be made with a template
  var result = {} as foodStatsItem;
  result.food_name = foodStatsItem.food_name;
  result.nf_calories = (foodStatsItem.nf_calories * multiplier) || 0;
  result.nf_cholesterol = (foodStatsItem.nf_cholesterol * multiplier) || 0;
  result.nf_dietary_fiber = (foodStatsItem.nf_dietary_fiber * multiplier) || 0;
  result.nf_potassium = (foodStatsItem.nf_potassium * multiplier) || 0;
  result.nf_protein = (foodStatsItem.nf_protein * multiplier) || 0;
  result.nf_saturated_fat = (foodStatsItem.nf_saturated_fat * multiplier) || 0;
  result.nf_sodium = (foodStatsItem.nf_sodium * multiplier) || 0;
  result.nf_sugars = (foodStatsItem.nf_sugars * multiplier) || 0;
  result.nf_total_carbohydrate = (foodStatsItem.nf_total_carbohydrate  * multiplier) || 0;
  result.nf_total_fat = (foodStatsItem.nf_total_fat * multiplier) || 0;
  result.serving_qty = (foodStatsItem.serving_qty * multiplier);
  result.serving_unit = foodStatsItem.serving_unit;
  result.tags = foodStatsItem.tags;
  console.log("set")
  console.log(result);
  return result;
}

const calculateFoodStatsItemGet = (foodStatsItem: foodStatsItem, multiplier: number) : foodStatsItem => {
  // console.log(foodStatsItem)
  // console.log("GET")
  var result = {} as foodStatsItem;
  result.food_name = foodStatsItem.food_name;
  result.nf_calories = (foodStatsItem.nf_calories * multiplier);
  result.nf_cholesterol = (foodStatsItem.nf_cholesterol * multiplier);
  result.nf_dietary_fiber = (foodStatsItem.nf_dietary_fiber * multiplier);
  result.nf_potassium = (foodStatsItem.nf_potassium * multiplier);
  result.nf_protein = (foodStatsItem.nf_protein * multiplier);
  result.nf_saturated_fat = (foodStatsItem.nf_saturated_fat * multiplier);
  result.nf_sodium = (foodStatsItem.nf_sodium * multiplier);
  result.nf_sugars = (foodStatsItem.nf_sugars * multiplier);
  result.nf_total_carbohydrate = (foodStatsItem.nf_total_carbohydrate * multiplier);
  result.nf_total_fat = (foodStatsItem.nf_total_fat * multiplier);
  result.serving_qty = (foodStatsItem.serving_qty * multiplier);
  result.serving_unit = foodStatsItem.serving_unit;
  result.tags = foodStatsItem.tags;
  //console.log(result);
  return result;
}