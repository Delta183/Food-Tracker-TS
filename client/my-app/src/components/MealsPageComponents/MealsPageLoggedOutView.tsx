import styles from "../../styles/App.module.css"

const MealsPageLoggedOutView = () => {
  return <div className={styles.errorTitle}>
      <h2>Please login to see the meals of users</h2>
    </div>
};

export default MealsPageLoggedOutView;
