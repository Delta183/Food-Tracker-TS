import styles from "../../styles/FoodSearch.module.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { foodStatsItem } from "../../models/foodStatsItem";
import { totalsArray } from "../../models/totalsArray";
import CalculationTableComponent from "./CalculationTableComponent";

interface IProps {
  calculateStats: () => void;
  incrementValues: (calculationResults: foodStatsItem[]) => void;
  calculationResults: foodStatsItem[];
  totalsArray: totalsArray;
  didChangeOccur: boolean;
}

const CalculationComponent = (props: IProps) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.calculationButton}>
        <Button onClick={props.calculateStats} variant="primary" size="lg">
          Calculate
        </Button>{" "}
      </div>
      <CalculationTableComponent 
        calculationResults={props.calculationResults} 
        totalsArray={props.totalsArray}/>
    </div>
  );
};

export default CalculationComponent;
