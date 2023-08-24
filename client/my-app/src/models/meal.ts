import { foodSearchItem } from "./foodSearchItem";
import { foodStatsItem } from "./foodStatsItem";
import { totalsArray } from "./totalsArray";

export interface Meal {
  _id: string;
  userId: string;
  title: string; // The title of meal
  text?: string; // The optional description of the meal
  username?: string;
  createdAt: string;
  updatedAt: string;
  selections: foodSearchItem[]; // The selection of foods the user chose
  selectionsStats: foodStatsItem[]; // The stats of said selections
  totalsArray: totalsArray; // The totals of each element of the selections
}
