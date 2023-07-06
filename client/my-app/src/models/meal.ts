import { foodSearchItem } from "./foodSearchItem";

export interface Meal {
  _id: string;
  title: string;
  text?: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  selections: foodSearchItem[];
}
