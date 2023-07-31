import styles from "../../styles/FoodSearch.module.css";
import { foodStatsItem } from "../../models/foodStatsItem";
import { totalsArray } from "../../models/totalsArray";
import CalculationTableComponent from "./CalculationTableComponent";

interface IProps {
  calculationResults: foodStatsItem[];
  totalsArray: totalsArray;
}

const CalculationComponent = (props: IProps) => {
  return (
    <div className={styles.searchContainer}>
      <CalculationTableComponent 
        calculationResults={props.calculationResults} 
        totalsArray={props.totalsArray}/>
    </div>
  );
};

export default CalculationComponent;
