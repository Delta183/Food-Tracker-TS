import styles from "../../styles/Meal.module.css";
import { formatDate } from "../../utils/formatDate";
import { Card } from "react-bootstrap";
// This is aliasing (x as y) just so we can refer to it as a name that is different
import { Meal as MealModel } from "../../models/meal";
import Accordion from 'react-bootstrap/Accordion';
import { MdDelete } from "react-icons/md"; // md means material design
import stylesUtils from "../../styles/utils.module.css";
import FoodItemDisplayComponent from "../FoodItemDisplayComponent";

// An interface to declare what variables the Note needs
// It can be done without it in JS but its not as certain
// Props is the arguments unto which we pass to the component.
interface MealProps {
  meal: MealModel;
  onMealClicked: (meal: MealModel) => void;
  onDeleteMealClicked: (meal: MealModel) => void;
  className?: string;
}

// Prior to NoteProps is the chunk of the arguments that will be passed
const Note = ({
  meal,
  className,
  onMealClicked,
  onDeleteMealClicked,
}: MealProps) => {
  // it appears that food items are not accessible at this level
  const { title, text, createdAt, updatedAt, username, selections } = meal;

  let createdUpdatedText: string;
  if (updatedAt > createdAt) {
    createdUpdatedText = "Updated: " + formatDate(updatedAt);
  } else {
    createdUpdatedText = "Created: " + formatDate(createdAt);
  }

  return (
    // The second className here is the props, not a typo dupe
    <Card
    className={styles.mealCard}
    >
      <Card.Body>
        <Card.Title className={stylesUtils.flexCenter}>
          {title} by: {username}
          <MdDelete
            className="text-muted ms-auto"
            onClick={(e) => {
              onDeleteMealClicked(meal);
              // Allows this click to go through
              e.stopPropagation();
            }}
          />
        </Card.Title>
        <Card.Text className={styles.mealCardText}>{text}</Card.Text>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Food Selections</Accordion.Header>
            <Accordion.Body>
            {selections.map((selection) => {
              return <FoodItemDisplayComponent tagID={selection.tag_id} foodItem={selection}/>
            })}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {/* {selections.map((selection) => {
            return <Card.Text className={styles.cardText}>{selection}</Card.Text>
          })} */}
      </Card.Body>
      <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
    </Card>
  );
};

export default Note;
