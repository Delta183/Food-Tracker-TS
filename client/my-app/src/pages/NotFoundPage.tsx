import styles from ".././styles/App.module.css"

const NotFoundPage = () => {
  return (
    <div className={styles.errorTitle}>
      <h2>Page not found</h2>
      <h2>Press any of the options of the bar above to return to the correct pages.</h2>
    </div>
  );
};

export default NotFoundPage;
