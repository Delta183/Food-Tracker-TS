import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import styles from "../../styles/MealsPage.module.css";
import MealTest from "./MealTest";

const MealsPageTestView = () => {
    return (
        <Container className={styles.mealsPage}>
            <h1>Meals</h1>
            <MealTest/>
        </Container>
    );    
}

export default MealsPageTestView;