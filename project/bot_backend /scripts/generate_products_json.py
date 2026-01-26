import json
from sqlalchemy import create_engine, MetaData, select
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# -------------------------------
# 1. Loading environment variables
# -------------------------------
load_dotenv(dotenv_path="../.env")
DATABASE_URL = os.getenv("DATABASE_URL")
print("POSTGRES DB", DATABASE_URL)

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
products_table = metadata.tables["products"]
categories_table = metadata.tables["products_categories"]

# -------------------------------
# 4. GET products
# -------------------------------
products_data = []

products = session.execute(
    select(
        products_table.c.id,
        products_table.c.name,
        products_table.c.description,
        products_table.c.price,
        products_table.c.avaible,
        products_table.c.isPublic,
        products_table.c.image_url,
        categories_table.c.name.label("category_name"),
    ).join(
        categories_table,
        products_table.c.category_id == categories_table.c.id
    )
).fetchall()

for product in products:
    products_data.append({
        "id": product.id,
        "name": product.name,
        "category": product.category_name,
        "description": product.description or "",
        "price": float(product.price),  
        "available": product.avaible if product.avaible is not None else False,
        "is_public": product.isPublic,
        "image_url": product.image_url or "",
        "tags": []  # for future
    })

# -------------------------------
# 5. Save JSON
# -------------------------------
os.makedirs("../data", exist_ok=True)

with open("../data/products.json", "w", encoding="utf-8") as f:
    json.dump(products_data, f, ensure_ascii=False, indent=2)

print(f"Generated {len(products_data)} products in ../data/products.json")
