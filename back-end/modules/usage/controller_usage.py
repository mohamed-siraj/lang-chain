from modules.usage.model_useage import usage_response_dto, usage_request_dto
from database_clients.mongodb_client import mongodb_client
from fastapi import Body, Depends
from typing import List
import pandas as pd
from fastapi import FastAPI
from modules.auth.service_jwt import get_current_user, get_current_user_admin

db = mongodb_client["chat_db"]

models_collection = db["models"]
messages_collection = db["messages"]

usage_controller = FastAPI()

@usage_controller.post("/personal", response_model=List[usage_response_dto])
def get_usage(usage_details: usage_request_dto = Body(...), current_user = Depends(get_current_user)):
    data = messages_collection.find({"created_at": {'$lt':usage_details.date_end, '$gte':usage_details.date_start}, "user_id":str(current_user["_id"])},{ "_id": 0, "token_usage": 1, "total_cost": 1, "created_at":1 })
    df = pd.DataFrame(data)
    if(len(df)==0):
        return []
    
    df = df.groupby(pd.Grouper(key='created_at', freq=usage_details.frequency)).sum().reset_index().to_dict('records')
    
    return [{"date":str(i["created_at"]), "token_usage":i["token_usage"], "total_cost":i["total_cost"]} for i in df]

@usage_controller.post("/all", response_model=List[usage_response_dto])
def get_usage(usage_details: usage_request_dto = Body(...), current_user = Depends(get_current_user_admin)):
    data = messages_collection.find({"created_at": {'$lt':usage_details.date_end, '$gte':usage_details.date_start}},{ "_id": 0, "token_usage": 1, "total_cost": 1, "created_at":1 })
    df = pd.DataFrame(data)
    if(len(df)==0):
        return []
    
    df = df.groupby(pd.Grouper(key='created_at', freq=usage_details.frequency)).sum().reset_index().to_dict('records')
    
    return [{"date":str(i["created_at"]), "token_usage":i["token_usage"], "total_cost":i["total_cost"]} for i in df]