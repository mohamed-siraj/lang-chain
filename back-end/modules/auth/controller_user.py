from bson import ObjectId
from fastapi import HTTPException
from database_clients.mongodb_client import mongodb_client
from fastapi import status
from modules.auth.model_user import User

db = mongodb_client["chat_db"]
user_collection = db["user"]

def create_user(user_data):
    existing_user = get_user_by_email(user_data["email"])
    if not existing_user:
        user = User(**user_data)
        user_dict = user.dict()
                
        result = user_collection.insert_one(user_dict)
        return str(result.inserted_id)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='User Already Exists',
            headers={'WWW-Authenticate': 'Bearer'},
        )

def get_user(user_id):
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    return user

def get_user_by_email(email):
    user = user_collection.find_one({"email": email})
    return user

def update_user(user_id, user_data):
    result = user_collection.update_one({"_id": ObjectId(user_id)}, {"$set": user_data})
    return result.modified_count

def delete_user(user_id):
    result = user_collection.delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count

    