// import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { foodSearchItem } from "../models/foodSearchItem";
import { foodStatsItem } from "../models/foodStatsItem";
import { Meal } from "../models/meal";
import { User } from "../models/user";

// These parameters allow us to call it much like a fetch function
async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
  }
} // There is no export for this function as we will use it in this file

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData("/api/users", { method: "GET" });
  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData("/api/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetchData("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function logout() {
  await fetchData("/api/users/logout", { method: "POST" });
}

// We write Promise<Meal[]> as a safeguard
export async function fetchMeals(): Promise<Meal[]> {
  const response = await fetchData("/api/meals", { method: "GET" });
  return response.json();
}

export async function fetchMeal(mealId: string | undefined): Promise<Meal> {
  const response = await fetchData(`/api/meals/${mealId}`, { method: "GET" });
  return response.json();
}

// Meal creation below
export interface MealInput {
  title: string;
  text?: string;
  selections: foodSearchItem[];
  selectionsStats: foodStatsItem[];
  username?: string;
}

export async function createMeal(meal: MealInput): Promise<Meal> {
  const response = await fetchData("/api/meals", {
    // POST as we putting these values to the MongoDB
    method: "POST",
    // The header denotes the format the data will be in
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meal),
  });
  return response.json();
}

// Update
export async function updateMeal(
  mealId: string,
  meal: MealInput
): Promise<Meal> {
  const response = await fetchData("/api/meals/" + mealId, {
    // Patch will be used for updates
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meal),
  });
  return response.json();
}

// Delete
export async function deleteMeal(mealId: string) {
  // We add the id here to match the route in the server file as well as the id for which to delete
  await fetchData("/api/meals/" + mealId, { method: "DELETE" });
}
