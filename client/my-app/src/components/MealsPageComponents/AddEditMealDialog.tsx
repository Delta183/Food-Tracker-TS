import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Meal } from "../../models/meal";
import { MealInput } from "../../network/meals.api";
import * as MealsApi from "../../network/meals.api";
import TextInputField from "../form/TextInputField";
import { foodSearchItem } from "../../models/foodSearchItem";
// import FoodItemComponent from "../FoodItemComponent";
// import { useState } from "react";

interface AddEditMealDialogProps {
  user: string | undefined;
  mealToEdit?: Meal; // Variable to differentiate a note to be added and one to be updated
  foodSelections: foodSearchItem[]; // The list of selections
  onDismiss: () => void;
  onMealSaved: (meal: Meal) => void;
}

// The props this component will need when declared with the interface above just making it clear what types they will be
const AddEditMealDialog = ({
  user,
  onDismiss,
  foodSelections,
  onMealSaved,
  mealToEdit,
}: AddEditMealDialogProps) => {
  // const [selections, setSelections] = useState<foodSearchItem[]>(foodSelections);

  // const removeFoodSelection = async (tagID: string) => {
  //   setSelections((previousFoodSelections: foodSearchItem[]) => {
  //     const existingFoodSelections = previousFoodSelections.filter(
  //       (foodItem: foodSearchItem) => foodItem.tag_id !== tagID
  //     );
  //     // console.log(existingFoodSelections)
  //     return existingFoodSelections;
  //   });
  // };

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
      input.username = user;
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

          {mealToEdit ? (
            <>
              {/* Below is where we will put the food selections and the means to choose more */}
              {/* {selections.map((selection) => {
            return <FoodItemComponent 
              tagID={selection.tag_id} 
              foodItem={selection} 
              buttonConfig={{
                disabled: false,
                className: "danger",
                title: "Remove",
                onClick: removeFoodSelection(selection.tag_id),
              }}/>
          })} */}
            </>
          ) : (
            <></>
          )}
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
