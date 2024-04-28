import { Box, Typography, Button } from "@mui/material";
import { Recipe, Ingredient, Step } from "../Types/Types";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../configs/configs";

interface DisplayRecipeProps {
  selectedRecipe: Recipe | undefined;
  isAdmin: boolean;
  onDeleteRecipe: (recipeId: string) => void;
  onRecipeUpdate: (updatedRecipe: Recipe) => void;
}

const DisplayRecipe = ({
  selectedRecipe,
  isAdmin,
  onDeleteRecipe,
  onRecipeUpdate,
}: DisplayRecipeProps) => {
  useEffect(() => {});

  const handleDeleteRecipe = () => {
    if (selectedRecipe) {
      onDeleteRecipe(selectedRecipe.id);
    }
  };

  const [likeButtonsEnabled, setLikeButtonsEnabled] = useState(true);

  const handleLikeRecipe = async () => {
    if (selectedRecipe) {
      try {
        const response = await axios.put(
          `${API_URL}/recipes/like/${selectedRecipe.id}`
        );

        if (response.status === 200) {
          const updatedRecipe = {
            ...selectedRecipe,
            likes: selectedRecipe.likes + 1,
          };
          onRecipeUpdate(updatedRecipe);
          setLikeButtonsEnabled(false);
        } else {
          console.error("Failed to like the recipe");
        }
      } catch (error) {
        console.error("Error liking the recipe:", error);
      }
    }
  };

  return (
    <Box border={1} borderColor="grey.300" p={1}>
      <Typography variant="h5" gutterBottom p={5}>
        {selectedRecipe?.title || "No Recipe Selected"}
      </Typography>
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
      {isAdmin ? (
        <Box p={2}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRecipe}
          >
            Delete Recipe
          </Button>
        </Box>
      ) : (
        <Box p={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<ThumbUpIcon />}
            onClick={handleLikeRecipe}
            disabled={!likeButtonsEnabled}
          >
            Like
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DisplayRecipe;
