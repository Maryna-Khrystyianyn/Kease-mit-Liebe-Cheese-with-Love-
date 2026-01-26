from fastapi import FastAPI 
from dotenv import load_dotenv
import os

app = FastAPI() 

load_dotenv(dotenv_path="../.env")
DATABASE_URL = os.getenv("DATABASE_URL")
print("POSTGRES DB",DATABASE_URL)

@app.get("/") 
def read_root(): 
    return {"message": "Hello from FastAPI!"}