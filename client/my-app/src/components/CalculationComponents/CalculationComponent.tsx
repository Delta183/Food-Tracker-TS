import styles from "../../styles/FoodSearch.module.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { foodStatsItem } from "../../models/foodStatsItem";

interface IProps {
  calculateStats: () => void;
  incrementValues: (calculationResults: foodStatsItem[]) => void;
  calculationResults: foodStatsItem[];
  statsArray: Array<number>;
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
          {props.statsArray.length > 0 ? (
            <tr>
              <td>Total</td>
              <td></td>
              {props.statsArray.map((element) => {
                return <td>{element.toFixed(2)}</td>
              })}
              {/* toFixed(2) ensures these are returned as strings up to 2 decimal places */}
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
