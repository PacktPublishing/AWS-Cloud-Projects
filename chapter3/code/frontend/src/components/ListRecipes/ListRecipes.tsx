import { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Recipe } from "../Types/Types";
import { Typography } from "@mui/material";

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

  const message = recipes.length === 0 && (
    <p> There are no recipes created yet</p>
  );

  return (
    <FormControl>
      <Typography variant="h6" gutterBottom p={2}>
        List of Recipes
      </Typography>
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
                <FormControlLabel
                  key={recipe.id}
                  value={recipe.id.toString()}
                  control={<Radio />}
                  label={recipe.title}
                />
              );
            })
          : null}
      </RadioGroup>
    </FormControl>
  );
}

export default ListRecipes;
