import express from "express";
import * as MealsController from "../controllers/meals"

// We set endpoints on this router and pass it to the main express object
const router = express.Router();

router.get("/", MealsController.getMeals);
router.get("/:mealId", MealsController.getMeal);
router.post("/", MealsController.createMeal);
router.patch("/:mealId", MealsController.updateMeal);
router.delete("/:mealId", MealsController.deleteMeal);

export default router;