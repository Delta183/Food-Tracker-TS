import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Meal } from "../../models/meal";
import { MealInput } from "../../network/meals.api";
import * as MealsApi from "../../network/meals.api";
import TextInputField from "../form/TextInputField";
import { foodSearchItem } from "../../models/foodSearchItem";
import { foodStatsItem } from "../../models/foodStatsItem";
import { totalsArray } from "../../models/totalsArray";

interface AddEditMealDialogProps {
  user: string | undefined;
  mealToEdit?: Meal; // Variable to differentiate a note to be added and one to be updated
  foodSelections: foodSearchItem[]; // The list of selections
  selectionsStats: foodStatsItem[];
  totalsArray: totalsArray;
  onDismiss: () => void;
  onMealSaved: (meal: Meal) => void;
}

// The props this component will need when declared with the interface above just making it clear what types they will be
const AddEditMealDialog = ({
  user,
  onDismiss,
  foodSelections,
  selectionsStats,
  totalsArray,
  onMealSaved,
  mealToEdit,
}: AddEditMealDialogProps) => {
  // Since the hook returns multiple values, we deconstruct the variables
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MealInput>({
    defaultValues: {
      title: mealToEdit?.title || "",
      text: mealToEdit?.text || "",
    },
  });

  async function onSubmit(input: MealInput) {
    try {
      let mealResponse: Meal;
      // Be sure to set as it isn't by default and this will otherwise be a means to update new choices
      input.selections = foodSelections;
      // TODO: Handle the calculation of the selections should they skip it to happen here
      input.username = user;
      // Presumably here is where the calculations will be saved and put into the meals object
      input.selectionsStats = selectionsStats;

      input.totalsArray = totalsArray;
      // Check for if note is one to edit or one to add, call the according function
      if (mealToEdit) {
        mealResponse = await MealsApi.updateMeal(mealToEdit._id, input);
      } else {
        mealResponse = await MealsApi.createMeal(input);
      }
      onMealSaved(mealResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>
          {/* Ternary operator for if in edit or adding */}
          {mealToEdit ? "Edit meal" : "Add meal"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Our async function had the same name incidentally, curious syntax */}
        <Form id="addEditMealForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="title"
            label="Title"
            type="text"
            placeholder="Title"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.title}
          />

          <TextInputField
            name="text"
            label="Text"
            as="textarea"
            rows={5}
            placeholder="Text"
            register={register}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* The type is a built in functionality for the button on click
                form also denotes which form of input the button is connected to */}
        <Button type="submit" form="addEditMealForm" disabled={isSubmitting}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditMealDialog;
