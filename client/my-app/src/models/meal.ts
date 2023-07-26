import { foodSearchItem } from "./foodSearchItem";
import { foodStatsItem } from "./foodStatsItem";

export interface Meal {
  _id: string;
  title: string;
  text?: string;
  username?: string;
  createdAt: string;
  updatedAt: string;
  selections: foodSearchItem[];
  selectionsStats: foodStatsItem[];
}
