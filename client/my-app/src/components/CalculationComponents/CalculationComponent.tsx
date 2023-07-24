import styles from "../../styles/FoodSearch.module.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { foodStatsItem } from "../../models/foodStatsItem";
import { totalsArray } from "../../models/totalsArray";

interface IProps {
  calculateStats: () => void;
  incrementValues: (calculationResults: foodStatsItem[]) => void;
  calculationResults: foodStatsItem[];
  totalsArray: totalsArray;
}

const CalculationComponent = (props: IProps) => {
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

  return (
    <div className={styles.searchContainer}>
      <div className={styles.calculationButton}>
        <Button onClick={props.calculateStats} variant="primary" size="lg">
          Calculate
        </Button>{" "}
      </div>

      <Table responsive hover={true} variant="light" bordered={true}>
        <thead>
          <tr>
            <th>Name</th>
            {Array.from({ length: 11 }).map((_, index) => (
              <th key={index}>{tableHeaders.at(index)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.calculationResults.map((result) => {
            // Prior to displaying the stats of each food, add their values to the totals
            return (

              <tr>
                <td style={{ textTransform: "capitalize" }}>
                  {result.food_name}
                </td>
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
          {props.totalsArray != null ? (
            <tr>
              <td>Total</td>
              <td></td>
              <td>{props.totalsArray.calories.toFixed(2)}</td>
              <td>{props.totalsArray.totalFat.toFixed(2)}</td>
              <td>{props.totalsArray.saturatedFat.toFixed(2)}</td>
              <td>{props.totalsArray.cholesterol.toFixed(2)}</td>
              <td>{props.totalsArray.sodium.toFixed(2)}</td>
              <td>{props.totalsArray.totalCarbs.toFixed(2)}</td>
              <td>{props.totalsArray.fiber.toFixed(2)}</td>
              <td>{props.totalsArray.sugars.toFixed(2)}</td>
              <td>{props.totalsArray.protein.toFixed(2)}</td>
              <td>{props.totalsArray.potassium.toFixed(2)}</td>
            </tr>
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CalculationComponent;
