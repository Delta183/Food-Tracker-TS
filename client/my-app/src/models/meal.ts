import { foodSearchItem } from "./foodSearchItem";
import { foodStatsItem } from "./foodStatsItem";
import { totalsArray } from "./totalsArray";

export interface Meal {
  _id: string;
  userId: string;
  title: string;
  text?: string;
  username?: string;
  createdAt: string;
  updatedAt: string;
  selections: foodSearchItem[];
  selectionsStats: foodStatsItem[];
  totalsArray: totalsArray;
}
