import styles from "../../styles/FoodSearch.module.css";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const CalculationComponent = () => {
    const tableHeaders = ["Calories", "Total Fat", "Saturated Fat", "Cholesterol", "Sodium", "Total Carbs", "Fiber","Sugars","Protein","Potassium"];

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
    <Button variant="primary">Calculate</Button>{' '}
      </div>
      
    );
  };
  
  export default CalculationComponent;