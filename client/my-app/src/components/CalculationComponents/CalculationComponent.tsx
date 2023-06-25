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
  const [calculationResults, setCalculationResults] = useState(Array<foodStatsItem>());
  const [calculationResultError, setCalculationResultError] = useState<Error | null>(
    null
  );
  const tableHeaders = [
    "Serving Quantity",
    "Calories",
    "Total Fat",
    "Saturated Fat",
    "Cholesterol",
    "Sodium",
    "Total Carbs",
    "Fiber",
    "Sugars",
    "Protein",
    "Potassium",
  ];

    // Use the function in the api class to get a json response in an array and use the states to set it
    const performCalculation = async (query: string) => {
      // A function like this is able to maintain its results and errors and be set within its body
      calculateStatistics(query, (results, error) => {
        setCalculationResults(results);
        setCalculationResultError(error);
      });
    };
  

  const calculateStats = () => {
    var searchQuery = "";
    // So far this is working with the right string but that bug of the last item in the selection persists
    props.foodSelections.forEach((foodItem) => {
      var foodString = `${foodItem.quantity} ${foodItem.food_name}, `
      searchQuery += foodString 
    })
    console.log("Query" + searchQuery)
    performCalculation(searchQuery)
  };

  // Will fetch the selections from local storage, the real issue lies in passing that information

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
          <tr>
            <td>1</td>
            {Array.from({ length: 11 }).map((_, index) => (
              <td key={index}>Table cell {index}</td>
            ))}
          </tr>
          <tr>
            <td>2</td>
            {Array.from({ length: 11 }).map((_, index) => (
              <td key={index}>Table cell {index}</td>
            ))}
          </tr>
          <tr>
            <td>3</td>
            {Array.from({ length: 11 }).map((_, index) => (
              <td key={index}>Table cell {index}</td>
            ))}
          </tr>
        </tbody>
      </Table>
      <Button onClick={calculateStats} variant="primary">Calculate</Button>{" "}
    </div>
  );
};

export default CalculationComponent;
