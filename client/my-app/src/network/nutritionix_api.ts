import { foodSearchItem } from "../models/foodSearchItem";

// The REACT_APP part of the variable names allow for env variables
const key = process.env.REACT_APP_NUTRITIONIX_API_KEY || "";
const id = process.env.REACT_APP_NUTRITIONIX_API_ID || "";

const searchFoodsWithQuery = async (
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

export default searchFoodsWithQuery;
