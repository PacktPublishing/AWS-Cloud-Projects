import { Box, Typography, Button } from "@mui/material";
import { Recipe, Ingredient, Step } from "../Types/Types";

import { useEffect } from "react";

interface DisplayRecipeProps {
  selectedRecipe: Recipe | undefined;
  isAdmin: boolean;
  onDeleteRecipe: (recipeId: string) => void;
}

const DisplayRecipe = ({
  selectedRecipe,
  isAdmin,
  onDeleteRecipe,
}: DisplayRecipeProps) => {
  useEffect(() => {});

  const handleDeleteRecipe = () => {
    if (selectedRecipe) {
      onDeleteRecipe(selectedRecipe.id);
    }
  };
  return (
    <Box border={1} borderColor="grey.300" p={1}>
      <Typography variant="h5" gutterBottom p={5}>
        {selectedRecipe?.title || "No Recipe Selected"}
      </Typography>
      {/*RECIPE INGREDIENTS SECTION*/}
      <Box mb={4} border={1} borderColor="grey.300" p={2}>
        <Typography variant="h6" gutterBottom p={5}>
          Ingredients
        </Typography>

        {selectedRecipe?.ingredients.map(
          (ingredient: Ingredient, index: number) => (
            <Typography key={ingredient.id} variant="body1" p={1} align="left">
              Ingredient {index + 1}. {ingredient.description}
            </Typography>
          )
        )}
      </Box>
      {/*RECIPE STEPS SECTION*/}
      <Box border={1} borderColor="grey.300" p={2}>
        <Typography variant="h6" gutterBottom p={5}>
          Recipe Steps
        </Typography>
        {selectedRecipe?.steps.map((step: Step, index: number) => (
          <Typography key={step.id} variant="body1" p={1} align="left">
            Step {index + 1}. {step.description}
          </Typography>
        ))}
      </Box>
      {isAdmin && (
        <Box p={2}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRecipe}
          >
            Delete Recipe
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DisplayRecipe;
