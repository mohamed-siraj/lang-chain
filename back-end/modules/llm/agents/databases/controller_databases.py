import os
from modules.llm.agents.databases.model_database import Databases_response_dto, Databases
from modules.auth.service_jwt import get_current_user
from database_clients.mongodb_client import mongodb_client
from fastapi import Depends, FastAPI, File, HTTPException, Body, UploadFile
from sqlalchemy.exc import OperationalError
from sqlite3 import OperationalError
from sqlalchemy import create_engine
from bson import ObjectId
from typing import List

db = mongodb_client["chat_db"]
databases_collection = db["databases"]

databases_controller = FastAPI()

@databases_controller.post("/add/credentials")
async def store_credentials_file(credentials_file: UploadFile = File(...)):
    try:
        # Check if the file has a .json extension
        if not credentials_file.filename.endswith(".json"):
            raise HTTPException(status_code=400, detail="Invalid file format. Only .json files are allowed.")
        
        # Save the file at the base path of the project
        file_path = os.path.join(os.environ.get('BIG_QUERY_CREDS_PATH'), credentials_file.filename)
        
        with open(file_path, "wb") as file:
            file.write(credentials_file.file.read())
        
        return {"status": "success", "message": f"Credentials file {credentials_file.filename} uploaded successfully."}
    except HTTPException as e:
        raise  # Re-raise HTTPException to maintain the correct status code and detail
    except Exception as e:
        return {"status": "error", "message": f"Failed to upload credentials file. Error: {str(e)}"}

@databases_controller.post("/", response_model=Databases_response_dto)
def create_database(database: Databases = Body(...), current_user = Depends(get_current_user)):
    databaseObj = database.dict()
    databaseObj["user_id"] = current_user["_id"]
    try:
        engine = create_engine(database.connection_string)
        connection = engine.connect()
        connection.close()
        print("Connection to the database was successful.")
        database_id = databases_collection.insert_one(databaseObj).inserted_id
        return {"database_name": database.database_name, "connection_string": database.connection_string, "id": str(database_id)}
    except OperationalError as e:
        print(f"Connection failed: {e}")
        raise HTTPException(status_code=400, detail="Database connection could not be made")

@databases_controller.get("/connection/{database_id}")
def check_connection(database_id:str, current_user = Depends(get_current_user)):
    database = databases_collection.find_one({"_id": ObjectId(database_id), "user_id" : current_user["_id"]})
    if not database:
        raise HTTPException(status_code=404, detail="Database not found")
    try:
        engine = create_engine(database["connection_string"])
        connection = engine.connect()
        connection.close()
        print("Connection to the database was successful.")
        return {"status": "connected"}
    except OperationalError as e:
        print(f"Connection failed: {e}")
        return {"status": "not connected"}

@databases_controller.get("/{database_id}", response_model=Databases_response_dto)
def read_database(database_id: str, current_user = Depends(get_current_user)):
    database = databases_collection.find_one({"_id": ObjectId(database_id), "user_id":current_user["_id"]})
    if not database:
        raise HTTPException(status_code=404, detail="Database not found")
    return {"database_name": database["database_name"], "connection_string": database["connection_string"], "id": str(database["_id"])}

@databases_controller.get("/", response_model=List[Databases_response_dto])
def get_all_databases(current_user = Depends(get_current_user)):
    databases = databases_collection.find({"user_id" : current_user["_id"]})
    return [{"database_name": db["database_name"], "connection_string": db["connection_string"], "id": str(db["_id"])} for db in databases]

@databases_controller.get("/name/{database_name}", response_model=Databases_response_dto)
def get_database_by_name(database_name: str, current_user:str = Depends(get_current_user)):
    database = databases_collection.find_one({"database_name": database_name, "user_id" : current_user["_id"]})
    if not database:
        raise HTTPException(status_code=404, detail="Database not found")
    return {"database_name": database["database_name"], "connection_string": database["connection_string"], "id": str(database["_id"])}

@databases_controller.put("/{database_id}", response_model=Databases_response_dto)
def update_database(database_id: str, database: Databases = Body(...), current_user = Depends(get_current_user)):
    existing_database = databases_collection.find_one({"_id": ObjectId(database_id), "user_id" : current_user["_id"]})
    if not existing_database:
        raise HTTPException(status_code=404, detail="Database not found")
    
    databases_collection.update_one({"_id": ObjectId(database_id)}, {"$set": database.dict()})
    return {"database_name": database.database_name, "connection_string": database.connection_string, "id": database_id}

@databases_controller.delete("/{database_id}", response_model=Databases_response_dto)
def delete_database(database_id: str, current_user = Depends(get_current_user)):
    database = databases_collection.find_one({"_id": ObjectId(database_id), "user_id" : current_user["_id"]})
    if not database:
        raise HTTPException(status_code=404, detail="Database not found")
    
    databases_collection.delete_one({"_id": ObjectId(database_id)})
    return {"database_name": database["database_name"], "connection_string": database["connection_string"], "id": str(database["_id"])}
