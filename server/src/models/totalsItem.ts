import { InferSchemaType, model, Schema } from "mongoose";

const totalsItemSchema = new Schema({
    calories: {type: Number},
    totalFat: {type: Number},
    saturatedFat: {type: Number},
    cholesterol: {type: Number},
    sodium: {type: Number},
    totalCarbs: {type: Number},
    fiber: {type: Number},
    sugars: {type: Number},
    protein: {type: Number},
    potassium: {type: Number},
})

// This is for type safety and code completion pertinent to the type
type TotalsItem = InferSchemaType<typeof totalsItemSchema>;

// This is pertinent to the use of the schema as an object
export default model<TotalsItem>("TotalsItem", totalsItemSchema);
