import styles from "../../styles/Meal.module.css";
import { formatDate } from "../../utils/formatDate";
import { Card } from "react-bootstrap";
// This is aliasing (x as y) just so we can refer to it as a name that is different
import { Meal as MealModel } from "../../models/meal";
import Accordion from 'react-bootstrap/Accordion';
import { MdDelete } from "react-icons/md"; // md means material design
import stylesUtils from "../../styles/utils.module.css";

// An interface to declare what variables the Note needs
// It can be done without it in JS but its not as certain
// Props is the arguments unto which we pass to the component.

// Prior to NoteProps is the chunk of the arguments that will be passed
const MealTest = () => {

  let createdUpdatedText: string;

  return (
    // The second className here is the props, not a typo dupe
    <Card
      className={`${styles.mealCard}`}
    >
      <Card.Body>
        <Card.Title className={stylesUtils.flexCenter}>
          Classic Breakfast by Daniel
          <MdDelete
            className="text-muted ms-auto"
            onClick={(e) => {
              console.log("Boi");
              // Allows this click to go through
              e.stopPropagation();
            }}
          />
        </Card.Title>
        <Card.Text className={styles.mealCardText}>A meal my grandparents always had</Card.Text>
        <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
        {/* {selections.map((selection) => {
            return <Card.Text className={styles.cardText}>{selection}</Card.Text>
          })} */}
      </Card.Body>
      <Card.Footer className="text-muted">Created on Dec 16th</Card.Footer>
    </Card>
  );
};

export default MealTest;
