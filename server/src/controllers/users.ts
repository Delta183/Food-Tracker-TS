import { RequestHandler, response } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import env from "../util/validateEnv";


const key = env.NUTRITIONIX_API_KEY || "";
const id = env.NUTRITIONIX_API_ID || "";


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

        // const apiResponseJson = await apiResponse.json()
        // await db.collection('collection').insertOne(apiResponseJson)
        // console.log(apiResponseJson)
    

    // const response = await fetchData("search/" + mealId, {
    //     // Patch will be used for updates
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(meal),
    //   });


// .then((response) => response.json())
//   .then((searchResponse) => {
//       const errorMessage = searchResponse["Error"];
//       if (errorMessage !== null && errorMessage !== undefined) {
//         const error = new Error(errorMessage);
//         callback([], error);
//       } else {
//         // In the response, I get two arrays in an array where "common" is the header
//         // for the common set of food
//         const searchResponseResults: foodSearchItem[] =
//           searchResponse["common"];
//         // This will filter items with the same ids in the array
//         var cleanResults: foodSearchItem[] = searchResponseResults.filter(
//           (searchResponseResults, index, self) =>
//             index ===
//             self.findIndex((t) => t.tag_id === searchResponseResults.tag_id)
//         );
//         if (Array.isArray(cleanResults)) {
//           callback(cleanResults, null);
//         } else {
//           callback([], null);
//         }
//       }
//     })
//     .catch((error) => {
//       console.log(`Something went wrong: ${error}`);
//       callback([], error);
//     });

