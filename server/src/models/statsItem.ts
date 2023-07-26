import { InferSchemaType, model, Schema } from "mongoose";

const statsItemSchema = new Schema({
    food_name: { type: String },
    serving_qty: { type: String }, // This will be a point of reference for its increments
    serving_unit: { type: String },
    nf_calories: { type: Number },
    nf_total_fat: { type: Number },
    nf_saturated_fat: { type: Number },
    nf_cholesterol: { type: Number },
    nf_sodium: { type: Number },
    nf_total_carbohydrate: { type: Number },
    nf_dietary_fiber: { type: Number },
    nf_sugars: { type: Number },
    nf_protein: { type: Number },
    nf_potassium: { type: Number },
    tags: { tag_id: String },
})

// This is for type safety and code completion pertinent to the type
type StatsItem = InferSchemaType<typeof statsItemSchema>;

// This is pertinent to the use of the schema as an object
export default model<StatsItem>("StatsItem", statsItemSchema);
