export interface foodSearchItem {
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

// The search query and the nutrition query provide different results and thus must separate the food models
