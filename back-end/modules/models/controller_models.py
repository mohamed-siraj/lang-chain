from modules.auth.service_jwt import get_current_user_super_admin
from database_clients.mongodb_client import mongodb_client
from fastapi import Depends, FastAPI, HTTPException, Body
from modules.models.model_models import Model
from bson import ObjectId
from typing import List

db = mongodb_client["chat_db"]
models_collection = db["models"]

models_controller = FastAPI()

@models_controller.post("/", response_model=Model)
def create_model(model: Model = Body(...), current_user = Depends(get_current_user_super_admin)):
    model_id = models_collection.insert_one(model.dict()).inserted_id
    return {"name": model.name, "input_token_price": model.input_token_price, "output_token_price": model.output_token_price, "id": str(model_id)}

@models_controller.get("/{model_id}", response_model=Model)
def read_model(model_id: str):
    model = models_collection.find_one({"_id": ObjectId(model_id)})
    if not model:
        raise HTTPException(status_code=404, detail=" model not found")
    return {"name": model["name"], "input_token_price": model["input_token_price"], "output_token_price": model["output_token_price"], "id": str(model["_id"])}

@models_controller.get("/", response_model=List[Model])
def get_all_models():
    models = models_collection.find({})
    return [{"name": model["name"], "input_token_price": model["input_token_price"], "output_token_price": model["output_token_price"], "id": str(model["_id"])} for model in models]

@models_controller.get("/name/{model_name}", response_model=Model)
def get_model_by_name(model_name: str):
    model = models_collection.find_one({"name": model_name})
    if not model:
        raise HTTPException(status_code=404, detail=" model not found")
    return {"name": model["name"], "input_token_price": model["input_token_price"], "output_token_price": model["output_token_price"], "id": str(model["_id"])}

@models_controller.put("/{model_id}", response_model=Model)
def update_model(model_id: str, model: Model = Body(...), current_user = Depends(get_current_user_super_admin)):
    existing_model = models_collection.find_one({"_id": ObjectId(model_id)})
    if not existing_model:
        raise HTTPException(status_code=404, detail=" model not found")
    
    models_collection.update_one({"_id": ObjectId(model_id)}, {"$set": model.dict()})
    return {"name": model.name, "input_token_price": model.input_token_price, "output_token_price": model.output_token_price, "id": model_id}

@models_controller.delete("/{model_id}", response_model=Model)
def delete_model(model_id: str, current_user = Depends(get_current_user_super_admin)):
    model = models_collection.find_one({"_id": ObjectId(model_id)})
    if not model:
        raise HTTPException(status_code=404, detail=" model not found")
    
    models_collection.delete_one({"_id": ObjectId(model_id)})
    return {"name": model["name"], "input_token_price": model["input_token_price"], "output_token_price": model["output_token_price"], "id": str(model["_id"])}

