import MealModel from "../models/meal";
import FoodItemModel from "../models/foodItem";
import mongoose from "mongoose";
import * as bson from 'bson';
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { assertIsDefined } from "../util/assertIsDefined";

export const getMeals : RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);
        // Get the meals from our database
        // execute the find function to get all MealModels in the database
        const meals = await MealModel.find({ userId: authenticatedUserId }).exec();        
        res.status(200).json(meals); 
    } catch (error) {
       next(error);
    }
};

// TODO: Add one specifically for the users saved meals, perhaps getMealsByUserId or simply add it to users

export const getMeal: RequestHandler = async (req, res, next) => {
    // Referencing the variable in the router such that it can be read 
    const mealId = req.params.mealId;
    const authenticatedUserId = req.session.userId;

    try {
        // Prior to the endpoints being used, check for authentication
        assertIsDefined(authenticatedUserId);
        // Check if the given mealId adheres to the structures of ids
        if (!mongoose.isValidObjectId(mealId)) {
            throw createHttpError(400, "Invalid meal id");
        }

        const meal = await MealModel.findById(mealId).exec();

        // Provided a valid id, check if the meal fetched is null/does not exist
        if (!meal) {
            throw createHttpError(404, "Meal not found");
        }

        // If the user id of the meal does not match the user, they do not have the rights to modify it
        if (!meal.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this meal");
        }

        res.status(200).json(meal);
    } catch (error) {
        next(error);
    }
};

interface CreateMealBody {
    // Question mark (?) denotes the variable as optional
    username?: string,
    title?: string,
    text?: string,
    selections: ClientFoodSearchItem[]
}

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

// export const convertSelectionToFoodItemModel: typeof FoodItemModel = async (selection: ClientFoodSearchItem) => {
//     const newFoodItemModel = await FoodItemModel.create
// }


// We pass unknown instead of any because the latter is too unrestricted and ambiguous. 
// unknown has a greater degree of restriction
export const createMeal: RequestHandler<unknown, unknown, CreateMealBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const selections = req.body.selections;
    const username = req.body.username;
    const authenticatedUserId = req.session.userId;
    // Go through the selection and iterate through the req.selections and convert it into Mongoose friendly selections

    try {
        assertIsDefined(authenticatedUserId);
        // Ensure the title is there for the meals
        if (!title) {
            throw createHttpError(400, "Meal must have a title");
        }
        // eslint-disable-next-line no-var
        var convertedOutputs = []; 
        for (const selection of selections) {
            const newSelection = await FoodItemModel.create({
                food_name: selection.food_name,
                serving_qty: selection.serving_qty, // This will be a point of reference for its increments
                quantity: selection.quantity,
                serving_unit: selection.serving_unit,
                photo: selection.photo
            });
            convertedOutputs.push(newSelection)
        }
        // provided the title and text, username and selections, we create a new MealModel object
        const newMeal = await MealModel.create({
            userId: authenticatedUserId,
            username: username,
            title: title,
            text: text,
            selections: convertedOutputs // convertedSelections
        });
        // Send the new meal back as a JSON object
        res.status(201).json(newMeal);
    } catch (error) {
        next(error);
    }
};

interface UpdateMealParams {
    mealId: string,
}

interface UpdateMealBody {
    title?: string,
    text?: string,
    username?: string,
    selections: ClientFoodSearchItem[]
}

// The order for RequestHandler is Params, response, body, query params
export const updateMeal: RequestHandler<UpdateMealParams, unknown, UpdateMealBody, unknown> = async (req, res, next) => {
    const mealId = req.params.mealId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const newSelections = req.body.selections;
    const authenticatedUserId = req.session.userId;


    try {
        assertIsDefined(authenticatedUserId);

        // Check for is the id is in the proper structure
        if (!mongoose.isValidObjectId(mealId)) {
            throw createHttpError(400, "Invalid meal id");
        }

        // Check if newTitle was provided
        if (!newTitle) {
            throw createHttpError(400, "Meal must have a title");
        }

        const meal = await MealModel.findById(mealId).exec();

        // Check if the meal retrieved actually exists to begin with
        if (!meal) {
            throw createHttpError(404, "Meal not found");
        }

        if (!meal.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this meal");
        }

        // Otherwise overwrite the title, selections and text and then save the meal
        meal.title = newTitle;
        meal.text = newText;
        // meal.selections = newSelections;

        const updatedMeal = await meal.save();

        res.status(200).json(updatedMeal);
    } catch (error) {
        next(error);
    }
};

export const deleteMeal: RequestHandler = async (req, res, next) => {
    const mealId = req.params.mealId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(mealId)) {
            throw createHttpError(400, "Invalid meal id");
        }

        const meal = await MealModel.findById(mealId).exec();

        if (!meal) {
            throw createHttpError(404, "Meal not found");
        }

        if (!meal.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this meal");
        }

        // .remove could not be found but this should be just as effective
        await meal.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};