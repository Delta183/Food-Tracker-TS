export interface foodStatsItem {
  food_name: string;
  serving_qty: number; // The amount in each serving
  serving_unit: string; // The unit of measurement for each serving
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
