import { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Recipe } from "../Types/Types";
import { Box, FormLabel, IconButton, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface ListRecipesProps {
  selectedRecipe: string | null;
  setSelectedRecipe: (recipeId: string | null) => void;
  setTextFieldValue: (recipeId: string) => void;
  recipes: Recipe[] | [];
}

function ListRecipes({
  selectedRecipe,
  setSelectedRecipe,
  setTextFieldValue,
  recipes = [],
}: ListRecipesProps) {
  const [initialValue, setInitialValue] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (recipes.length > 0 && selectedRecipe === null) {
      setSelectedRecipe(recipes[0].id);
      setTextFieldValue(recipes[0].id.toString());
      setInitialValue(recipes[0].id.toString());
    }
  }, [recipes, selectedRecipe, setSelectedRecipe, setTextFieldValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const recipeId = event.target.value === "" ? null : event.target.value;
    setSelectedRecipe(recipeId);
    setTextFieldValue(recipeId !== null ? recipeId.toString() : "");
  };

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  const sortedRecipes = recipes.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.likes - b.likes;
    } else {
      return b.likes - a.likes;
    }
  });

  const message = recipes.length === 0 && (
    <p> There are no recipes created yet</p>
  );

  return (
    <FormControl>
      <Typography variant="h6" gutterBottom p={2}>
        List of Recipes
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        borderBottom={1}
        borderColor="divider"
      >
        <FormLabel component="legend">Sort by Likes: </FormLabel>
        <IconButton onClick={() => handleSortChange("asc")}>
          <ArrowUpwardIcon
            color={sortOrder === "asc" ? "primary" : "inherit"}
          />
          <Typography
            variant="body2"
            color={sortOrder === "asc" ? "primary" : "inherit"}
          >
            Ascending
          </Typography>
        </IconButton>
        <IconButton onClick={() => handleSortChange("desc")}>
          <ArrowDownwardIcon
            color={sortOrder === "desc" ? "primary" : "inherit"}
          />
          <Typography
            variant="body2"
            color={sortOrder === "desc" ? "primary" : "inherit"}
          >
            Descending
          </Typography>
        </IconButton>
      </Box>
      {message}
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={selectedRecipe !== null ? selectedRecipe.toString() : ""}
        onChange={handleChange}
      >
        {recipes
          ? recipes.map((recipe) => {
              return (
                <Box key={recipe.id} display="flex" alignItems="right">
                  <Box
                    ml={2}
                    p={2}
                    display="flex"
                    alignItems="center"
                    sx={{ flexDirection: "row" }}
                  >
                    <ThumbUpIcon fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      {recipe.likes.toString()}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    value={recipe.id.toString()}
                    control={<Radio />}
                    label={recipe.title}
                  />
                </Box>
              );
            })
          : null}
      </RadioGroup>
    </FormControl>
  );
}

export default ListRecipes;
