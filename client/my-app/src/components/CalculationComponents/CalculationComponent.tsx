import styles from "../../styles/FoodSearch.module.css";
import { foodStatsItem } from "../../models/foodStatsItem";
import { totalsArray } from "../../models/totalsArray";
import CalculationTableComponent from "./CalculationTableComponent";

interface IProps {
  calculationResults: foodStatsItem[] | undefined; // The stats of each individual selection
  totalsArray: totalsArray | undefined; // The totals of all of the stats
}

// The Calculation component that holds the table with the statistics of each item
// As well as the total of all the individual items. Both are held in their own arrays
const CalculationComponent = (props: IProps) => {
  return (
    <div className={styles.searchContainer}>
      <h2>Calculations</h2>
      <CalculationTableComponent
        calculationResults={props.calculationResults}
        totalsArray={props.totalsArray}
      />
    </div>
  );
};

export default CalculationComponent;
