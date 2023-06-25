import styles from "../../styles/FoodSearch.module.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { foodSearchItem } from "../../models/foodSearchItem";

interface IProps {
    foodSelections: foodSearchItem[]; // the selected food item from the list
  }

const CalculationComponent = (props: IProps) => {
  const tableHeaders = [
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

  var searchQuery = "";
  // So far this is working with the right string but that bug of the last item in the selection persists
  props.foodSelections.forEach((foodItem) => {
    var foodString = `${foodItem.quantity} ${foodItem.food_name}, `
    searchQuery += foodString 
    // console.log(searchQuery)
})
console.log(searchQuery)
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
            {Array.from({ length: 10 }).map((_, index) => (
              <th key={index}>{tableHeaders.at(index)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            {Array.from({ length: 10 }).map((_, index) => (
              <td key={index}>Table cell {index}</td>
            ))}
          </tr>
          <tr>
            <td>2</td>
            {Array.from({ length: 10 }).map((_, index) => (
              <td key={index}>Table cell {index}</td>
            ))}
          </tr>
          <tr>
            <td>3</td>
            {Array.from({ length: 10 }).map((_, index) => (
              <td key={index}>Table cell {index}</td>
            ))}
          </tr>
        </tbody>
      </Table>
      <Button variant="primary">Calculate</Button>{" "}
    </div>
  );
};

export default CalculationComponent;
