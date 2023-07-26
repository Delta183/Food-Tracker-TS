import styles from "../../styles/Meal.module.css";
import { formatDate } from "../../utils/formatDate";
import { Card } from "react-bootstrap";
// This is aliasing (x as y) just so we can refer to it as a name that is different
import { Meal as MealModel } from "../../models/meal";
import Accordion from "react-bootstrap/Accordion";
import { MdDelete } from "react-icons/md"; // md means material design
import stylesUtils from "../../styles/utils.module.css";
import FoodItemDisplayComponent from "../FoodItemDisplayComponent";
import { Link } from 'react-router-dom';

// An interface to declare what variables the Note needs
// It can be done without it in JS but its not as certain
// Props is the arguments unto which we pass to the component.
interface MealProps {
  meal: MealModel;
  onMealClicked: (meal: MealModel) => void;
  onDeleteMealClicked: (meal: MealModel) => void;
}

// Prior to NoteProps is the chunk of the arguments that will be passed
const Meals = ({
  meal,
  onMealClicked,
  onDeleteMealClicked,
}: MealProps) => {
  // it appears that food items are not accessible at this level
  const { title, text, createdAt, updatedAt, username } = meal;

  let createdUpdatedText: string;
  if (updatedAt > createdAt) {
    createdUpdatedText = "Updated: " + formatDate(updatedAt);
  } else {
    createdUpdatedText = "Created: " + formatDate(createdAt);
  }

  return (
    // The second className here is the props, not a typo dupe
    <Card className={styles.mealCard}>
      <Card.Body>
        <Card.Title className={stylesUtils.flexCenter}>
          {title} by: {username}
          <Link to={`/meals/${meal._id}`}><p className="font-italic type m-0">View Details</p></Link>
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
          {/*<Accordion.Item eventKey="0">
              <Accordion.Header>Food Selections</Accordion.Header>
            <Accordion.Body>
              {selections.map((selection) => {
                return (
                  <FoodItemDisplayComponent
                    tagID={selection.tag_id}
                    foodItem={selection}
                  />
                );
              })}
            </Accordion.Body> 
            </Accordion.Item> */}
        </Accordion>
      </Card.Body>

      <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
    </Card>
  );
};

export default Meals;
