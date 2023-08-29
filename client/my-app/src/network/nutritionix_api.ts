import { foodSearchItem } from "../models/foodSearchItem";
import { foodStatsItem } from "../models/foodStatsItem";
import LRU from "../utils/LRUCache";
// The REACT_APP part of the variable names allow for env variables
// const key = process.env.REACT_APP_NUTRITIONIX_API_KEY || "";
// const id = process.env.REACT_APP_NUTRITIONIX_API_ID || "";


// These parameters allow us to call it much like a fetch function
async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  // console.log(response);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
  }
} // There is no export for this function as we will use it in this file


export const searchFoodsWithQuery = async (query: string) : Promise<foodSearchItem[]> => {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return [];
  }
  const response = await fetchData(`/api/users/search/${trimmedQuery}`, {method: "GET"});
  return response.json();
};

export const calculateStatistics = async ( query: string) : Promise<foodStatsItem> => {

  const trimmedQuery = query.trim();

  const response = await fetchData(`/api/users/searchStatistics/${trimmedQuery}`, {method: "GET"});

  return response.json();
};
