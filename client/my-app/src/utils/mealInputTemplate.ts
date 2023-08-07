import { MealInput } from "../network/meals.api";
import totalsTemplate from "./totalsTemplate";

const mealInputTemplate: MealInput = {
    title: "",
    text: "",
    selections: [],
    selectionsStats: [],
    totalsArray: totalsTemplate,
    username: "",
  };

  export default mealInputTemplate