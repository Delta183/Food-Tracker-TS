import { useState } from "react";
import styles from "../../styles/FoodSearch.module.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { foodSearchItem } from "../../models/foodSearchItem";
import { calculateStatistics } from "../../network/nutritionix_api";
import { foodStatsItem } from "../../models/foodStatsItem";

interface IProps {
  foodSelections: foodSearchItem[]; // the selected food item from the list
}

const CalculationComponent = (props: IProps) => {
  var caloriesTotal = 0;
  var totalFatTotal = 0;
  var saturatedFatTotal = 0;
  var cholesterolTotal = 0;
  var sodiumTotal = 0;
  var totalCarbsTotal = 0;
  var fiberTotal = 0;
  var sugarsTotal = 0;
  var proteinTotal = 0;
  var potassiumTotal = 0;

  const [calculationResults, setCalculationResults] = useState(
    Array<foodStatsItem>()
  );
  // TODO: Manage this error for when this search inevitably yields inaccurate content
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [calculationResultError, setCalculationResultError] =
    useState<Error | null>(null);

  const tableHeaders = [
    "Serving Quantity",
    "Calories (kcal)",
    "Total Fat (g))",
    "Saturated Fat (g)",
    "Cholesterol (mg)",
    "Sodium (mg)",
    "Total Carbs (g)",
    "Fiber (g)",
    "Sugars (g)",
    "Protein (g)",
    "Potassium (mg)",
  ];

  // Use the function in the api class to get a json response in an array and use the states to set it
  const performCalculation = async (query: string) => {
    // A function like this is able to maintain its results and errors and be set within its body
    calculateStatistics(query, (results, error) => {
      setCalculationResults(results);
      setCalculationResultError(error);
    });
  };

  // when the button is clicked, construct a string using the selections
  const calculateStats = () => {
    // be sure to reset the values for the next calculation
    resetValues();
    var searchQuery = "";
    // So far this is working with the right string but that bug of the last item in the selection persists
    props.foodSelections.forEach((foodItem) => {
      var foodString = `${foodItem.quantity} ${foodItem.food_name}, `;
      searchQuery += foodString;
    });
    // console.log("Query" + searchQuery)
    performCalculation(searchQuery);
  };

  // Upon the start of another calculation, we have to be sure to reset the values
  const resetValues = () => {
    caloriesTotal = 0;
    totalFatTotal = 0;
    saturatedFatTotal = 0;
    cholesterolTotal = 0;
    sodiumTotal = 0;
    totalCarbsTotal = 0;
    fiberTotal = 0;
    sugarsTotal = 0;
    proteinTotal = 0;
    potassiumTotal = 0;
  };

  // incrementing values with each item read in the selections array
  const incrementValues = (foodStatsItem: foodStatsItem) => {
    caloriesTotal += foodStatsItem.nf_calories;
    totalFatTotal += foodStatsItem.nf_total_fat;
    saturatedFatTotal += foodStatsItem.nf_saturated_fat;
    cholesterolTotal += foodStatsItem.nf_cholesterol;
    sodiumTotal += foodStatsItem.nf_sodium;
    totalCarbsTotal += foodStatsItem.nf_total_carbohydrate;
    fiberTotal += foodStatsItem.nf_dietary_fiber;
    sugarsTotal += foodStatsItem.nf_sugars;
    proteinTotal += foodStatsItem.nf_protein;
    potassiumTotal += foodStatsItem.nf_potassium;
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchTitleLabel}>
        Below is the total calculations of your selections
      </div>
      <Table responsive variant="dark">
        <thead>
          <tr>
            <th>Name</th>
            {Array.from({ length: 11 }).map((_, index) => (
              <th key={index}>{tableHeaders.at(index)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calculationResults.map((result) => {
            // Prior to displaying the stats of each food, add their values to the totals
            incrementValues(result);
            return (
              <tr>
                {/* TODO: Capitalize the value here */}
                <td>{result.food_name}</td>
                <td>{result.serving_qty}</td>
                <td>{result.nf_calories}</td>
                <td>{result.nf_total_fat}</td>
                <td>{result.nf_saturated_fat}</td>
                <td>{result.nf_cholesterol}</td>
                <td>{result.nf_sodium}</td>
                <td>{result.nf_total_carbohydrate}</td>
                <td>{result.nf_dietary_fiber}</td>
                <td>{result.nf_sugars}</td>
                <td>{result.nf_protein}</td>
                <td>{result.nf_potassium}</td>
              </tr>
            );
          })}
          {/* Provided there are actually results, then show the total row as well. */}
          {calculationResults.length > 0 ? (
            <tr>
              <td>Total</td>
              <td></td>
              {/* toFixed(2) ensures these are returned as strings up to 2 decimal places */}
              <td>{caloriesTotal.toFixed(2)}</td>
              <td>{totalFatTotal.toFixed(2)}</td>
              <td>{saturatedFatTotal.toFixed(2)}</td>
              <td>{cholesterolTotal.toFixed(2)}</td>
              <td>{sodiumTotal.toFixed(2)}</td>
              <td>{totalCarbsTotal.toFixed(2)}</td>
              <td>{fiberTotal.toFixed(2)}</td>
              <td>{sugarsTotal.toFixed(2)}</td>
              <td>{proteinTotal.toFixed(2)}</td>
              <td>{potassiumTotal.toFixed(2)}</td>
            </tr>
          ) : (
            <></>
          )}
        </tbody>
      </Table>
      <Button onClick={calculateStats} variant="primary">
        Calculate
      </Button>{" "}
    </div>
  );
};

export default CalculationComponent;
