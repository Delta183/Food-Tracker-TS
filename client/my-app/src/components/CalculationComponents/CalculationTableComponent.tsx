/* eslint-disable eqeqeq */
import Table from "react-bootstrap/Table";
import { foodStatsItem } from "../../models/foodStatsItem";
import { totalsArray } from "../../models/totalsArray";

interface IProps {
  calculationResults: foodStatsItem[] | undefined; // The stats of each individual selection
  totalsArray: totalsArray | undefined; // The totals of all of the stats
}
const DECIMAL_PLACE = 2; // This is for the toFixed() function used on the results of the calculations

const CalculationTableComponent = (props: IProps) => {
  const tableHeaders = [
    "Serving Quantity",
    "Calories (kcal)",
    "Total Fat (g)",
    "Saturated Fat (g)",
    "Cholesterol (mg)",
    "Sodium (mg)",
    "Total Carbs (g)",
    "Fiber (g)",
    "Sugars (g)",
    "Protein (g)",
    "Potassium (mg)",
  ]; // Static titles for the columns in the table

  return (
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
        {/* Only display this rows if there are indeed selections, otherwise put nothing */}
        {props.calculationResults != undefined ? (
          props.calculationResults.map((result) => {
            // Prior to displaying the stats of each food, add their values to the totals
            return (
              <tr key={result.tags["tag_id"]}>
                <td style={{ textTransform: "capitalize" }}>
                  {result.food_name}
                </td>
                <td>
                  {result.serving_qty} {result.serving_unit}
                </td>
                <td>{result.nf_calories.toFixed(DECIMAL_PLACE) || 0}</td>
                <td>{result.nf_total_fat.toFixed(DECIMAL_PLACE) || 0}</td>
                <td>{result.nf_saturated_fat.toFixed(DECIMAL_PLACE) || 0}</td>
                <td>{result.nf_cholesterol.toFixed(DECIMAL_PLACE) || 0}</td>
                <td>{result.nf_sodium.toFixed(DECIMAL_PLACE) || 0}</td>
                <td>
                  {result.nf_total_carbohydrate.toFixed(DECIMAL_PLACE) || 0}
                </td>
                <td>{result.nf_dietary_fiber.toFixed(DECIMAL_PLACE) || 0}</td>
                <td>{result.nf_sugars.toFixed(DECIMAL_PLACE) || 0}</td>
                <td>{result.nf_protein.toFixed(DECIMAL_PLACE) || 0}</td>
                <td>{result.nf_potassium.toFixed(DECIMAL_PLACE) || 0}</td>
              </tr>
            );
          })
        ) : (
          <></>
        )}
        {/* Provided there are actually results, then show the total row as well. */}
        {props.totalsArray != null ? (
          <tr>
            <td>Total</td>
            <td></td>
            <td>
              {props.totalsArray.calories
                .toFixed(DECIMAL_PLACE)
                .replace("-0", "0") || 0}
            </td>
            <td>
              {props.totalsArray.totalFat
                .toFixed(DECIMAL_PLACE)
                .replace("-0", "0") || 0}
            </td>
            <td>
              {props.totalsArray.saturatedFat
                .toFixed(DECIMAL_PLACE)
                .replace("-0", "0") || 0}
            </td>
            <td>
              {props.totalsArray.cholesterol
                .toFixed(DECIMAL_PLACE)
                .replace("-0", "0") || 0}
            </td>
            <td>
              {props.totalsArray.sodium
                .toFixed(DECIMAL_PLACE)
                .replace("-0", "0") || 0}
            </td>
            <td>
              {props.totalsArray.totalCarbs
                .toFixed(DECIMAL_PLACE)
                .replace("-0", "0") || 0}
            </td>
            <td>
              {props.totalsArray.fiber
                .toFixed(DECIMAL_PLACE)
                .replace("-0", "0")}
            </td>
            <td>
              {props.totalsArray.sugars
                .toFixed(DECIMAL_PLACE)
                .replace("-0", "0")}
            </td>
            <td>
              {props.totalsArray.protein
                .toFixed(DECIMAL_PLACE)
                .replace("-0", "0")}
            </td>
            <td>
              {props.totalsArray.potassium
                .toFixed(DECIMAL_PLACE)
                .replace("-0", "0")}
            </td>
          </tr>
        ) : (
          <></>
        )}
      </tbody>
    </Table>
  );
};

export default CalculationTableComponent;
