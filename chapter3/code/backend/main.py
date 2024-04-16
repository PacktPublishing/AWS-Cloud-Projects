from fastapi import FastAPI, status
from typing import Union
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uuid
import boto3


class Ingredient(BaseModel):
    id: int
    description: str

class Step(BaseModel):
    id: int
    description: str

class Recipe(BaseModel):
    id:str
    title: str
    ingredients: List[Ingredient]
    steps: List[Step]

session = boto3.Session(

       region_name='SELECTED_REGION'
   )

dynamodb = session.resource('dynamodb')
table = dynamodb.Table('recipes')

# Configure CORS
origins = [
    "*", 
    
]

app = FastAPI(title="Recipe Sharing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#health check

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {"message": "Service is healthy"}

# read recipes
@app.get("/recipes", status_code=status.HTTP_200_OK)
async def get_all_recipes(): 
    try:
        response = table.scan()
        recipes = response['Items']
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            recipes.extend(response['Items'])
        recipes_list = [Recipe(**recipe) for recipe in recipes]
        return recipes_list
    except Exception as e:
        return {"message": f"Error retrieving recipes: {e}"}



#create recipe
@app.post("/recipes", status_code=status.HTTP_200_OK)
async def create_recipe(recipe: Recipe):
    try:
        table.put_item( Item={
            'id': str(uuid.uuid4()),
            'title': recipe.title,
            'ingredients':  [ingredient.dict() for ingredient in recipe.ingredients],
            'steps':  [steps.dict() for steps in recipe.steps]
            }
            )
        return {"message": "Recipe created successfully"}
    except Exception as e:
        return {"message": f"Error creating recipe: {e}"}



#delete recipe
@app.delete("/recipes/{recipe_id}", status_code=status.HTTP_200_OK)
async def delete_recipe(recipe_id: str):
    try:
        response = table.delete_item(
            Key={
                'id': recipe_id
            }
        )
        return {"message":response}
    except Exception as e:
        return {"message": f"Error deleting recipe: {e}"}



