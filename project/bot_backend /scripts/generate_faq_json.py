import json
from sqlalchemy import create_engine, MetaData, Table, select
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# -------------------------------
# 1. Load environment variables
# -------------------------------
load_dotenv(dotenv_path="../.env")  
DATABASE_URL = os.getenv("DATABASE_URL")
print("POSTGRES DB:", DATABASE_URL)

# -------------------------------
# 2. Connect to the database
# -------------------------------
engine = create_engine(DATABASE_URL)
metadata = MetaData()
metadata.reflect(bind=engine)  
Session = sessionmaker(bind=engine)
session = Session()

# -------------------------------
# 3. Connect to FAQ table
# -------------------------------
faq_table = metadata.tables['FAQ']  # або 'faq', як у твоїй базі

# -------------------------------
# 4. Get FAQ records
# -------------------------------
faq_data = []

faqs = session.execute(
    select(
        faq_table.c.id,
        faq_table.c.category,
        faq_table.c.question,
        faq_table.c.answer,
        faq_table.c.tags
    )
).fetchall()

for faq in faqs:
    # Convert the tag string to a list, if any
    tags_list = [t.strip() for t in faq.tags.split(",")] if faq.tags else []

    faq_data.append({
        "id": faq.id,
        "category": faq.category,
        "question": faq.question,
        "answer": faq.answer,
        "tags": tags_list
    })

# -------------------------------
# 5. Save JSON
# -------------------------------
os.makedirs("../data", exist_ok=True)
with open("../data/faqs.json", "w", encoding="utf-8") as f:
    json.dump(faq_data, f, ensure_ascii=False, indent=2)

print(f"Generated {len(faq_data)} FAQ in ../data/faqs.json")
