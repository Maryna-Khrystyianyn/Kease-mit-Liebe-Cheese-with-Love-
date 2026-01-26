import json
from bs4 import BeautifulSoup
from sqlalchemy import create_engine, MetaData, Table, select
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# -------------------------------
# 1. Loading environment variables
# -------------------------------
load_dotenv(dotenv_path="../.env")  
DATABASE_URL = os.getenv("DATABASE_URL")
print("POSTGRES DB",DATABASE_URL)

# -------------------------------
# 2. Connecting to the database
# -------------------------------
engine = create_engine(DATABASE_URL)
metadata = MetaData()
metadata.reflect(bind=engine)  
Session = sessionmaker(bind=engine)
session = Session()

# -------------------------------
# 3. Connecting tables
# -------------------------------
recipes_table = metadata.tables['recipes']
categories_table = metadata.tables['recipes_categories']
ingredients_table = metadata.tables['ingredients']
recipe_ingredients_table = metadata.tables['recipe_ingredients']

# -------------------------------
# 4. GET recipes
# -------------------------------
recipes_data = []

recipes = session.execute(
    select(
        recipes_table.c.id,
        recipes_table.c.name,
        recipes_table.c.description,
        recipes_table.c.body,
        recipes_table.c.aging,
        categories_table.c.name.label("category_name")
    ).join(categories_table, recipes_table.c.category_id == categories_table.c.id)
).fetchall()

for recipe in recipes:
    # HTML-> TEXT
    body_html = recipe.body or ""
    body_text = BeautifulSoup(body_html, "html.parser").get_text(separator="\n").strip()

    # ingridients
    ingredient_rows = session.execute(
        select(ingredients_table.c.name)
        .join(recipe_ingredients_table, ingredients_table.c.id == recipe_ingredients_table.c.ingredient_id)
        .where(recipe_ingredients_table.c.recipe_id == recipe.id)
    ).fetchall()

    ingredients_list = [i[0] for i in ingredient_rows]

    # Dictionary for JSON
    recipes_data.append({
        "id": recipe.id,
        "title": recipe.name,
        "category": recipe.category_name,
        "description": recipe.description or "",  
        "body": body_text,                        
        "aging_days": recipe.aging or 0,         
        "ingredients": ingredients_list
    })
# -------------------------------
# 5. Save JSON
# -------------------------------
os.makedirs("../data", exist_ok=True)
with open("../data/recipes.json", "w", encoding="utf-8") as f:
    json.dump(recipes_data, f, ensure_ascii=False, indent=2)

print(f"Generated {len(recipes_data)} recipes in ../data/recipes.json")