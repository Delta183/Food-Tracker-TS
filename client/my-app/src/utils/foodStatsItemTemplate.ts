import { foodStatsItem } from "../models/foodStatsItem";
import { TagArray } from "../models/foodStatsItem";

const newTagArray = {} as TagArray

const foodStatsItemTemplate: foodStatsItem = {
    food_name: "",
    serving_qty: 0,
    serving_unit: "",
    nf_calories: 0,
    nf_total_fat: 0,
    nf_saturated_fat: 0,
    nf_cholesterol: 0,
    nf_sodium: 0,
    nf_total_carbohydrate: 0,
    nf_dietary_fiber: 0,
    nf_sugars: 0,
    nf_protein: 0,
    nf_potassium: 0,
    tags: newTagArray,
};

export default foodStatsItemTemplate;
