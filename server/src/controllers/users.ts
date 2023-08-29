import { RequestHandler, response } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import env from "../util/validateEnv";
import LRU from "../util/LRUCache";


const key = env.NUTRITIONIX_API_KEY || "";
const id = env.NUTRITIONIX_API_ID || "";
// A cache of size 20 for the foodStatsItem
const cache = new LRU<ClientFoodStatsItem>(20);

// This is how we get the information from the database if the user is logged in,
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// a class to facilitate a streamlined consumption of data
interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password; // It is raw as this is the unhashed version
    // naming it as such makes it very evident this should not be the value saved to the database

    try {
        // Input validation  
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        // Check if username is taken
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        // Check if email has already been used for this account
        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        // This issue of userId not already knowing what type is needed was subverted with the @types folder
        req.session.userId = newUser._id;

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

// Similar to the signup but for login information
interface LoginBody {
    username?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        // No username or password
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        // The +password and +email are explicit requests for the values from the database
        const user = await UserModel.findOne({ username: username }).select("+password +email").exec();

        if (!user) {
            // For user and password give the same error message so the user doesn't brute force
            // their way into other accounts
            throw createHttpError(401, "Invalid credentials");
        }

        // Check if the passwords match
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

// Upon a logout, destroy the session that was underway
export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};

export interface ClientFoodSearchItem {
    food_name: string;
    serving_qty: string; // This will be a point of reference for its increments
    quantity: string;
    serving_unit: string;
    tag_id: string;
    photo: PhotoArray; // This is simply because of the way the api returned this information did so in an array
  }

  // This is how we handle nested arrays according
export interface PhotoArray {
    thumb: string;
}

export interface ClientFoodStatsItem {
    food_name: string;
    serving_qty: number;
    serving_unit: string;
    // Below are all the pertinent health stats pulled from the response.
    nf_calories: number;
    nf_total_fat: number;
    nf_saturated_fat: number;
    nf_cholesterol: number;
    nf_sodium: number;
    nf_total_carbohydrate: number;
    nf_dietary_fiber: number;
    nf_sugars: number;
    nf_protein: number;
    nf_potassium: number;
    tags: TagArray;
  }
  
  export interface TagArray {
    tag_id: string;
  }

// The following endpoint is for the nutrients search
export const search: RequestHandler = async (req, res, next) => {
    try {
        const { query } = req.params
       
        await fetch(
          `https://trackapi.nutritionix.com/v2/search/instant?query=${query}&branded=false`,
          {
            method: "GET",
            headers: {
              "x-app-key": key,
              "x-app-id": id,
              "Content-Type": "application/json",
              "x-remote-user-id": "0",
            },
        }).then((response) => response.json())
        .then((searchResponse) => {
            const errorMessage = searchResponse["Error"];
            if (errorMessage !== null && errorMessage !== undefined) {
            const error = new Error(errorMessage);
            } else {
            // In the response, I get two arrays in an array where "common" is the header
            // for the common set of food
            const searchResponseResults: ClientFoodSearchItem[] =
                searchResponse["common"];
            // This will filter items with the same ids in the array
            const cleanResults: ClientFoodSearchItem[] = searchResponseResults.filter(
                (searchResponseResults, index, self) =>
                index ===
                self.findIndex((t) => t.tag_id === searchResponseResults.tag_id)
            );
            // console.log(cleanResults)
            res.status(200).send(cleanResults);
            }
        })
        .catch((error) => {
            console.log(`Something went wrong: ${error}`);
            next(error);
        });
        } catch (err) {
            console.log(err)
            res.status(500).send('Something went wrong')
        }
  }

  // This endpoint below is for the statistics search endpoint
  export const searchStatistics: RequestHandler = async (req, res, next) => {
    try {
          //Here is where we pull from the cache if possible, however it would just be a single instance
        // we would have to do the caluclations accordingly to the values of the foodStatsItem if the
        // accompanying number is > 1
        // the name of the food is the key, the statsItem is the object
        // cache.clear()
        const { query } = req.params
        const queryArray = query.split(" ");
        const queryNumber = Number(queryArray[0]);
        // eslint-disable-next-line no-var
        var queryString = "";
        for (let i = 1; i < queryArray.length; i++) {
            queryString += `${queryArray[i]} `;
        } 
        const cacheResult = cache.get(queryString);
         // Assuming the item does exist, create a copy of the item for potential multiplying that
        // needs to be done if the number is greater than 1
        if (cacheResult !== undefined) {
            console.log("Pulled from cache");
            // If greater than 1, then do the requisite multiplication
            if (queryNumber !== 1) {
                res.status(200).send(calculateFoodStatsItemGet(cacheResult, queryNumber));
                return;
            } else {
                res.status(200).send(cacheResult);
                return;
            }
        }
        console.log(query) // "6 pizza,"
       
        await fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
            body: JSON.stringify({ query: `${query}` }),
            method: "POST",
            headers: {
              "x-app-key": key,
              "x-app-id": id,
              "Content-Type": "application/json",
              "x-remote-user-id": "0",
            },
          }).then((response) => response.json())
            .then((searchResponse) => {
                const errorMessage = searchResponse["Error"];
                if (errorMessage !== null && errorMessage !== undefined) {
                  const error = new Error(errorMessage);
                } else {
                  // In the response, I get two arrays in an array where "common" is the header
                  // for the common set of food
                  const searchResponseResults: ClientFoodStatsItem = searchResponse["foods"][0];
                  const sanitizedResults: ClientFoodStatsItem = sanitizeFoodStatsItem(
                    searchResponseResults
                  );
                  // console.log(searchResponseResults)
                  // Only set this at the base level of 1, if higher then the division must be made
                  // If lower, multiplication must be made
                  // Only set if the value/foodStatsItem doesn't already exist in the cache
                if (cacheResult === undefined) {
                    // If the value is greater than 1, bring the value down to the base value
                    const multiplier = 1 / queryNumber;
                    if (queryNumber >= 1) {
                        const cacheInput = calculateFoodStatsItemSet(sanitizedResults, multiplier);
                        cache.set(queryString, cacheInput);
                    // This should cover the weird cases between 0 and 1
                    } else if (queryNumber > 0) {
                        const cacheInput = calculateFoodStatsItemSet(sanitizedResults, multiplier);
                        cache.set(queryString, cacheInput);
                    } else {
                        const cacheInput = calculateFoodStatsItemSet(sanitizedResults, 0);
                        cache.set(queryString, cacheInput);
                    }
                }
                  if (sanitizedResults != null) {
                    res.status(200).send(sanitizedResults);
                  } else {
                    res.status(200).send([]);
                  }
                }
              })
              .catch((error) => {
                console.log(`Something went wrong: ${error}`);
              });
        } catch (err) {
            console.log(err)
            res.status(500).send('Something went wrong')
        }
  }

  // Helper functions for modifying elements of the foodStatsItem

const sanitizeFoodStatsItem = (foodStatsItem: ClientFoodStatsItem): ClientFoodStatsItem => {
    const result = {} as ClientFoodStatsItem;
    result.food_name = foodStatsItem.food_name;
    result.nf_calories = foodStatsItem.nf_calories || 0;
    result.nf_cholesterol = foodStatsItem.nf_cholesterol || 0;
    result.nf_dietary_fiber = foodStatsItem.nf_dietary_fiber || 0;
    result.nf_potassium = foodStatsItem.nf_potassium || 0;
    result.nf_protein = foodStatsItem.nf_protein || 0;
    result.nf_saturated_fat = foodStatsItem.nf_saturated_fat || 0;
    result.nf_sodium = foodStatsItem.nf_sodium || 0;
    result.nf_sugars = foodStatsItem.nf_sugars || 0;
    result.nf_total_carbohydrate = foodStatsItem.nf_total_carbohydrate || 0;
    result.nf_total_fat = foodStatsItem.nf_total_fat || 0;
    result.serving_qty = foodStatsItem.serving_qty;
    result.serving_unit = foodStatsItem.serving_unit;
    result.tags = foodStatsItem.tags;
    // console.log("sanitize");
    // console.log(result);
    return result;
    // console.log(result);
  };
  
  const calculateFoodStatsItemSet = (
    foodStatsItem: ClientFoodStatsItem,
    multiplier: number
  ): ClientFoodStatsItem => {
    // Currently nothing changes so the change must be made with a template
    const result = {} as ClientFoodStatsItem;
    result.food_name = foodStatsItem.food_name;
    result.nf_calories = foodStatsItem.nf_calories * multiplier || 0;
    result.nf_cholesterol = foodStatsItem.nf_cholesterol * multiplier || 0;
    result.nf_dietary_fiber = foodStatsItem.nf_dietary_fiber * multiplier || 0;
    result.nf_potassium = foodStatsItem.nf_potassium * multiplier || 0;
    result.nf_protein = foodStatsItem.nf_protein * multiplier || 0;
    result.nf_saturated_fat = foodStatsItem.nf_saturated_fat * multiplier || 0;
    result.nf_sodium = foodStatsItem.nf_sodium * multiplier || 0;
    result.nf_sugars = foodStatsItem.nf_sugars * multiplier || 0;
    result.nf_total_carbohydrate =
      foodStatsItem.nf_total_carbohydrate * multiplier || 0;
    result.nf_total_fat = foodStatsItem.nf_total_fat * multiplier || 0;
    result.serving_qty = foodStatsItem.serving_qty * multiplier;
    result.serving_unit = foodStatsItem.serving_unit;
    result.tags = foodStatsItem.tags;
    // console.log("set");
    // console.log(result);
    return result;
  };
  
  const calculateFoodStatsItemGet = (
    foodStatsItem: ClientFoodStatsItem,
    multiplier: number
  ): ClientFoodStatsItem => {
    // console.log(foodStatsItem)
    // console.log("GET")
    const result = {} as ClientFoodStatsItem;
    result.food_name = foodStatsItem.food_name;
    result.nf_calories = foodStatsItem.nf_calories * multiplier;
    result.nf_cholesterol = foodStatsItem.nf_cholesterol * multiplier;
    result.nf_dietary_fiber = foodStatsItem.nf_dietary_fiber * multiplier;
    result.nf_potassium = foodStatsItem.nf_potassium * multiplier;
    result.nf_protein = foodStatsItem.nf_protein * multiplier;
    result.nf_saturated_fat = foodStatsItem.nf_saturated_fat * multiplier;
    result.nf_sodium = foodStatsItem.nf_sodium * multiplier;
    result.nf_sugars = foodStatsItem.nf_sugars * multiplier;
    result.nf_total_carbohydrate =
      foodStatsItem.nf_total_carbohydrate * multiplier;
    result.nf_total_fat = foodStatsItem.nf_total_fat * multiplier;
    result.serving_qty = foodStatsItem.serving_qty * multiplier;
    result.serving_unit = foodStatsItem.serving_unit;
    result.tags = foodStatsItem.tags;
    //console.log(result);
    return result;
  };