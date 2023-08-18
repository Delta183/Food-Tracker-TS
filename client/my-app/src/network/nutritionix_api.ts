import { foodSearchItem } from "../models/foodSearchItem";
import { foodStatsItem } from "../models/foodStatsItem";
import LRU from "../utils/LRUCache";
// The REACT_APP part of the variable names allow for env variables
const key = process.env.REACT_APP_NUTRITIONIX_API_KEY || "";
const id = process.env.REACT_APP_NUTRITIONIX_API_ID || "";

// A cache of size 20 for the foodStatsItem
const cache = new LRU<foodStatsItem[]>(20);

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
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    callback(null as any, null);
    return;
  }
  const queryArray = trimmedQuery.split(" ");
  const queryNumber = queryArray[0]
  var queryString: string = "";
  for (let i = 1; i < queryArray.length; i++) {
    queryString += `${queryArray[i]} `; 
  }
  // const cacheResult = cache.get(queryString);

  
  // queryString = queryString.slice(0,-1);

  // console.log(queryNumber);
  // console.log(queryString);

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
        // console.log(searchResponseResults)
        // cache.set(queryString, searchResponseResults);
        // TODO: Ensure this is safe in terms of returning a single JSON object
        if ((searchResponseResults) != null) {
          callback(searchResponseResults, null);
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
