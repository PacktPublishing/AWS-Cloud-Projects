import { Grid, Button, Typography } from "@mui/material";
import DisplayRecipe from "../DisplayRecipe/DisplayRecipe";
import ListRecipes from "../ListRecipes/ListRecipes";
import { useState, useEffect } from "react";
import { IconLink, Item } from "../Helpers/Helpers";
import { Recipe } from "../Types/Types";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CreateRecipe from "../CreateRecipe/CreateRecipe";
import {
  CONFIG_MAX_RECIPES,
  CONFIG_ADMIN_PAGE_TITLE,
  CONFIG_USER_PAGE_TITLE,
  API_URL,
} from "../../configs/configs";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const RecipeContent = (props: { isAdmin: boolean }) => {
  // Data State
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // UI State
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [isNewRecipe, setisNewRecipe] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState("---");

  //Handlers
  const handleCancelCreation = () => {
    setisNewRecipe(false);
  };

  const handleSaveRecipe = async (newRecipe: Recipe) => {
    try {
      await createRecipeFromAPI(newRecipe);
      setRecipeList((prevRecipeList) => [...prevRecipeList, newRecipe]);
      setisNewRecipe(false);
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      const recipeListCopy: Recipe[] = JSON.parse(JSON.stringify(recipeList));
      await deleteRecipeFromAPI(recipeId);
      const updatedRecipeList = recipeListCopy.filter(
        (recipe) => recipe.id !== recipeId
      );
      setRecipeList(updatedRecipeList);
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  //API REQUESTS

  const fetchRecipesFromAPI = async () => {
    try {
      const response = await axios.get(API_URL + "/recipes");
      return response.data;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
  };

  const deleteRecipeFromAPI = async (recipeId: string) => {
    try {
      await axios.delete(API_URL + "/recipes/" + recipeId);
    } catch (error) {
      console.error("Error deleting recipes:", error);
    }
  };

  const createRecipeFromAPI = async (recipe: Recipe) => {
    try {
      await axios.post(API_URL + "/recipes", recipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipes = await fetchRecipesFromAPI();
        setRecipeList(recipes);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoaded(true); // Set isLoaded to true even if there's an error
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Navigation Bar */}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {props.isAdmin ? (
            <AdminPanelSettingsOutlinedIcon fontSize="large" />
          ) : (
            <PersonOutlineOutlinedIcon fontSize="large" />
          )}
        </Grid>
        <Grid item xs={4} justifyContent="center">
          <Typography align="center" variant="h5">
            {props.isAdmin ? CONFIG_ADMIN_PAGE_TITLE : CONFIG_USER_PAGE_TITLE}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <IconLink />
        </Grid>
      </Grid>
      {/* Render the components only if not creating a new recipe */}
      {!isNewRecipe ? (
        <>
          <Grid container spacing={1}>
            {/* Recipe Selector */}
            {!isNewRecipe ? (
              <Grid item xs={4}>
                <Item>
                  <ListRecipes
                    selectedRecipe={selectedRecipe}
                    setSelectedRecipe={setSelectedRecipe}
                    setTextFieldValue={setTextFieldValue}
                    recipes={recipeList}
                  />
                </Item>
                {!isNewRecipe ? (
                  <Item>
                    {props.isAdmin ? (
                      recipeList.length < CONFIG_MAX_RECIPES ? (
                        <>
                          <Button
                            variant="contained"
                            onClick={() => {
                              setisNewRecipe(true);
                            }}
                          >
                            Create New Recipe
                          </Button>
                          <Typography variant="body2" p={3}>
                            Maximum Number of Recipes allowed:{" "}
                            {CONFIG_MAX_RECIPES} | Total Recipes Created:{" "}
                            {recipeList.length}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" p={3}>
                          You've reached theMaximum Number of Recipes allowed:{" "}
                          {CONFIG_MAX_RECIPES}. If you want to create a new one,
                          make sure you delete one of the list.
                        </Typography>
                      )
                    ) : null}
                  </Item>
                ) : null}
              </Grid>
            ) : null}
            {/* Recipe Details */}
            <Grid item xs={8}>
              <Item>
                {isLoaded && !isNewRecipe && selectedRecipe !== null ? (
                  <DisplayRecipe
                    selectedRecipe={recipeList.find(
                      (recipe) => recipe.id === selectedRecipe
                    )}
                    isAdmin={props.isAdmin}
                    onDeleteRecipe={handleDeleteRecipe}
                  />
                ) : null}
              </Item>
            </Grid>
          </Grid>
        </>
      ) : null}
      {isNewRecipe ? (
        <>
          <Grid container spacing={1}>
            {/* Recipe Creation*/}
            <Grid item xs={2}></Grid>
            {/* Recipe Details */}
            <Grid item xs={8}>
              <Item>
                <CreateRecipe
                  onCancel={handleCancelCreation}
                  onSave={handleSaveRecipe}
                  new_id={uuidv4()}
                />
              </Item>
            </Grid>
            {/* Recipe Creation*/}
            <Grid item xs={2}></Grid>
          </Grid>
        </>
      ) : null}
    </>
  );
};

export default RecipeContent;
