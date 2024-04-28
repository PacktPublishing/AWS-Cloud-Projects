import { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import RecipeItem from "./RecipeItem";
import { Ingredient, Step, Recipe } from "../Types/Types";
import {
  CONFIG_MAX_INGREDIENTS,
  CONFIG_MAX_STEPS,
} from "../../configs/configs";

interface CreateRecipeProps {
  onCancel: () => void;
  onSave: (recipe: Recipe) => void;
  new_id: string;
}

const CreateRecipe = ({ onCancel, onSave, new_id }: CreateRecipeProps) => {
  const [localTitle, setLocalTitle] = useState("");
  const [steps, setSteps] = useState<Step[]>([{ id: 1, description: "" }]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, description: "" },
  ]);

  const MAX_STEPS = CONFIG_MAX_STEPS; // Define the maximum allowed steps
  const MAX_INGREDIENTS = CONFIG_MAX_INGREDIENTS; // Define the maximum allowed ingredients

  // RECIPE TITLE SECTION
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(event.target.value);
  };

  // INGREDIENTS SECTION

  const handleAddIngredient = () => {
    if (ingredients.length > 0) {
      const lastIngredient = ingredients[ingredients.length - 1];
      if (lastIngredient.description.trim() !== "") {
        if (ingredients.length < MAX_INGREDIENTS) {
          setIngredients((prevIngredients) => [
            ...prevIngredients,
            { id: prevIngredients.length + 1, description: "" },
          ]);
        } else {
          alert("You have reached the maximum number of ingredients allowed.");
        }
      } else {
        alert(
          "Please complete the previous ingredient before adding a new one."
        );
      }
    } else {
      // If the ingredients array is empty, add a new ingredient directly
      setIngredients([{ id: 1, description: "" }]);
    }
  };

  const handleDeleteIngredient = (id: number) => {
    setIngredients((prevIngredients) =>
      prevIngredients
        .filter((ingredient) => ingredient.id !== id)
        .map((ingredient, index) => ({ ...ingredient, id: index + 1 }))
    );
  };

  const handleIngredientDescriptionChange = (
    id: number,
    newDescription: string
  ) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.id === id
          ? { ...ingredient, description: newDescription }
          : ingredient
      )
    );
  };

  // RECIPE STEPS SECTION

  const handleAddStep = () => {
    if (steps.length > 0) {
      const lastStep = steps[steps.length - 1];
      if (lastStep.description.trim() !== "") {
        if (steps.length < MAX_STEPS) {
          setSteps((prevSteps) => [
            ...prevSteps,
            { id: prevSteps.length + 1, description: "" },
          ]);
        } else {
          alert("You have reached the maximum number of steps allowed.");
        }
      } else {
        alert("Please complete the previous step before adding a new one.");
      }
    } else {
      // If the steps array is empty, add a new step directly
      setSteps([{ id: 1, description: "" }]);
    }
  };

  const handleDeleteStep = (id: number) => {
    setSteps((prevSteps) =>
      prevSteps
        .filter((step) => step.id !== id)
        .map((step, index) => ({ ...step, id: index + 1 }))
    );
  };

  const handleDescriptionChange = (id: number, newDescription: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === id ? { ...step, description: newDescription } : step
      )
    );
  };

  // Buttons Functions
  // Save and Cancel buttons handlers
  const handleSave = () => {
    const recipe: Recipe = {
      id: new_id,
      title: localTitle,
      ingredients,
      steps,
      likes: 0,
    };
    onSave(recipe);
  };

  const handleCancel = () => {
    onCancel();
  };

  //RETURN SECTION

  return (
    <Box border={1} borderColor="grey.300" p={2}>
      <Typography variant="h5" gutterBottom p={5}>
        New Recipe
      </Typography>
      {/*RECIPE TITLE SECTION*/}
      <Box mb={4} border={1} borderColor="grey.300" p={2}>
        <Typography variant="h6" gutterBottom p={1}>
          Title
        </Typography>
        <TextField
          id="outlined-basic"
          label={"Recipe Title"}
          variant="outlined"
          required
          placeholder={"Please insert the Recipe Title"}
          value={localTitle}
          onChange={handleTitleChange}
        />
      </Box>
      {/*RECIPE INGREDIENTS SECTION*/}
      <Box mb={4} border={1} borderColor="grey.300" p={2}>
        {/* Display the maximum steps and total steps created */}
        <Typography variant="h6" gutterBottom p={5}>
          Ingredients
        </Typography>
        <Typography variant="body2">
          Maximum Recipe Ingredients allowed: {MAX_INGREDIENTS} | Total
          Ingredients created: {ingredients.length}
        </Typography>
        {ingredients.map((ingredient) => (
          <RecipeItem
            key={ingredient.id}
            id={ingredient.id}
            description={ingredient.description}
            onDelete={handleDeleteIngredient}
            onDescriptionChange={handleIngredientDescriptionChange}
            itemType="Ingredient"
          /> // Render RecipeItem for each step
        ))}
        <Button onClick={handleAddIngredient}>ADD INGREDIENT</Button>
      </Box>
      {/*RECIPE STEPS SECTION*/}
      <Box border={1} borderColor="grey.300" p={2}>
        <Typography variant="h6" gutterBottom p={5}>
          Recipe Steps
        </Typography>
        <Typography variant="body2">
          Maximum Recipe Steps allowed: {MAX_STEPS} | Total steps created:{" "}
          {steps.length}
        </Typography>
        {steps.map((item) => (
          <RecipeItem
            key={item.id}
            id={item.id}
            description={item.description}
            onDelete={handleDeleteStep}
            onDescriptionChange={handleDescriptionChange}
            itemType="Step"
          />
        ))}
        <Button onClick={handleAddStep}>ADD STEP</Button>
      </Box>
      {/* Save and Cancel buttons */}
      <Box mt={4} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={
            localTitle.trim() === "" ||
            ingredients.length === 0 ||
            steps.length === 0 ||
            ingredients[ingredients.length - 1].description.trim() === "" ||
            steps[steps.length - 1].description.trim() === ""
          }
        >
          Save
        </Button>
        <Box mx={2} />
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default CreateRecipe;
