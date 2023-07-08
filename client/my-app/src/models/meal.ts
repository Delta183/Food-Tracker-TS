import { foodSearchItem } from "./foodSearchItem";

export interface Meal {
  _id: string;
  title: string;
  text?: string;
  username?: string;
  createdAt: string;
  updatedAt: string;
  selections: foodSearchItem[];
}
