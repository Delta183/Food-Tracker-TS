import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Meal } from "../../models/meal";
import { MealInput } from "../../network/meals.api";
import * as MealsApi from "../../network/meals.api";
import TextInputField from "../form/TextInputField";
import { foodSearchItem } from "../../models/foodSearchItem";

interface AddEditMealDialogProps {
  mealToEdit?: Meal; // Variable to differentiate a note to be added and one to be updated
  foodSelections: foodSearchItem[]; // The list of selections
  onDismiss: () => void;
  onMealSaved: (meal: Meal) => void;
}

// The props this component will need when declared with the interface above just making it clear what types they will be
const AddEditMealDialog = ({
  onDismiss,
  foodSelections,
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
      name: mealToEdit?.name || "", // TODO: Change this to be the logged in user
    },
  });

  async function onSubmit(input: MealInput) {
    try {
      let mealResponse: Meal;
      input.selections = foodSelections;
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
            label="title"
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

          <TextInputField
            name="name"
            label="Text"
            as="textarea"
            rows={5}
            placeholder="Name"
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
