import { InferSchemaType, model, Schema } from "mongoose";

const foodItemSchema = new Schema({
    food_name: { type: String },
    serving_qty: { type: String }, // This will be a point of reference for its increments
    quantity: { type: String },
    serving_unit: { type: String },
    photo: {thumb: String}, 
    tag_id: {type: String},
})

// This is for type safety and code completion pertinent to the type
type FoodItem = InferSchemaType<typeof foodItemSchema>;

// This is pertinent to the use of the schema as an object
export default model<FoodItem>("FoodItem", foodItemSchema);
