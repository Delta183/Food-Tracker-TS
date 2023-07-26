import { InferSchemaType, model, Schema } from "mongoose";
import FoodItemModel from "./foodItem";
import FoodStatsModel from "./statsItem";

// The Schema resembles a class with attributes
const mealSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true }, // required is true akin to a DB
    username: {type: String},
    title: { type: String, required: true },
    text: { type: String }, // the optional description for this meal
    selections: {type: [FoodItemModel.schema]}, // arrays of objects are handled in this manner
    selectionsStats: {type: [FoodStatsModel.schema]},
}, { timestamps: true });

// This is for type safety and code completion pertinent to the type
type Meal = InferSchemaType<typeof mealSchema>;

// This is pertinent to the use of the schema as an object
export default model<Meal>("Meal", mealSchema);