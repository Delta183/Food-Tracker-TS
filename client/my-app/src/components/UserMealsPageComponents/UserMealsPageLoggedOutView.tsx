import styles from "../../styles/App.module.css"

const UserMealsPageLoggedOutView = () => {
  return <div className={styles.errorTitle}>
      <h2>Please login to see your meals</h2>   
    </div>
};

export default UserMealsPageLoggedOutView;
