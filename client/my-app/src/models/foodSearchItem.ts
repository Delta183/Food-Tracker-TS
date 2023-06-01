export interface foodSearchItem {
  food_name: string;
  serving_qty: number;
  tag_id: string;
  photo: PhotoArray; // This is simply because of the way the api returned this information
}

export interface PhotoArray {
  thumb: string;
}

// The search query and the nutrition query provide different results and thus must separate the food models
