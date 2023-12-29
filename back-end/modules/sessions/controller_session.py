import json
from modules.file_upload.service_file_upload import upload_misc_to_s3
from modules.auth.service_jwt import get_current_user
from database_clients.mongodb_client import mongodb_client
from modules.sessions.model_sessions import Message, Session, ShareSessionDto
from fastapi import Depends, HTTPException, Body
from datetime import datetime
from bson import ObjectId
from typing import List
from fastapi import FastAPI
from utils.misc import transform_object_list

db = mongodb_client["chat_db"]
messages_collection = db["messages"]
sessions_collection = db["sessions"]

session_controller = FastAPI()

@session_controller.get("/")
def get_all_sessions(current_user: str = Depends(get_current_user)):
    sessions = sessions_collection.find({"user_id":str(current_user["_id"])})
    return transform_object_list(sessions)

@session_controller.post("/")
def create_session(session: Session = Body(...), current_user: str = Depends(get_current_user)):
    session.user_id = str(current_user["_id"])
    session_id = sessions_collection.insert_one(session.dict()).inserted_id
    newSession = session.dict()
    newSession["_id"] =  str(session_id)
    return newSession

@session_controller.post("/{session_id}/share")
def share_session(session_id: str, shareSessionDto: ShareSessionDto = Body(...), current_user: str = Depends(get_current_user)):
    session = sessions_collection.find_one({"_id": ObjectId(session_id), "user_id":str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if "shared_emails" not in session:
        session["shared_emails"] = []
    shareSessionDto = shareSessionDto.dict()
    new_shared_emails = session["shared_emails"] + shareSessionDto["shared_emails"]
    sessions_collection.update_one({"_id": ObjectId(session_id)}, {"$set": { "shared_emails": new_shared_emails, "updated_at":datetime.now()}})
    return {"new_shared_emails":new_shared_emails}

@session_controller.post("/{session_id}/unshare")
def unshare_session(session_id: str, shareSessionDto: ShareSessionDto = Body(...), current_user: str = Depends(get_current_user)):
    session = sessions_collection.find_one({"_id": ObjectId(session_id), "user_id":str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if "shared_emails" not in session:
        session["shared_emails"] = []

    shareSessionDto = shareSessionDto.dict()
    outputShareList = []
    for i in session["shared_emails"]:
        addToList = True
        for j in shareSessionDto["shared_emails"]:
            if j == i: addToList = False
        if(addToList): outputShareList.append(i)

    sessions_collection.update_one({"_id": ObjectId(session_id)}, {"$set": { "shared_emails": outputShareList, "updated_at":datetime.now()}})
    return {"new_shared_emails":outputShareList}

@session_controller.post("/{session_id}/make_public")
def make_session_public(session_id: str, session: Session = Body(...), current_user: str = Depends(get_current_user)):
    session = sessions_collection.find_one({"_id": ObjectId(session_id), "user_id":str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    sessions_collection.update_one({"_id": ObjectId(session_id)}, {"$set": { "is_public": True, "updated_at":datetime.now()}})
    return {"message":"made public"}

@session_controller.get("/{session_id}", response_model=Session)
def get_session(session_id: str, current_user: str = Depends(get_current_user)):
    session = sessions_collection.find_one({"_id": ObjectId(session_id), "user_id":str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@session_controller.delete("/{session_id}")
def delete_session(session_id: str, current_user: str = Depends(get_current_user)):
    session = sessions_collection.find_one_and_delete({"_id": ObjectId(session_id), "user_id":str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    query = {"session_id": session_id, "user_id":str(current_user["_id"])}
    newvalues = { "$set": { "is_active": False } }
    messages_collection.update_many(query, newvalues)
    
    return {"name": session["name"], "id": str(session["_id"])}

@session_controller.get("/{session_id}/messages")
def get_messages_by_session(session_id: str, current_user: str = Depends(get_current_user)):
    session = sessions_collection.find_one({"_id": ObjectId(session_id), "user_id":str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = messages_collection.find({"session_id": session_id, "user_id":str(current_user["_id"]), "is_active":True})
    return transform_object_list(messages)

@session_controller.get("/{session_id}/messages/shared")
def get_messages_by_session_shared(session_id: str, current_user: str = Depends(get_current_user)):

    session = sessions_collection.find_one({"_id": ObjectId(session_id), "user_id":str(current_user["_id"])})
    if session:
        messages = messages_collection.find({"session_id": session_id, "user_id":str(current_user["_id"]), "is_active":True})
        return transform_object_list(messages)

    session = sessions_collection.find_one({"_id": ObjectId(session_id)})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if("is_public" in session and session["is_public"]):
        messages = messages_collection.find({"session_id": session_id, "user_id":str(current_user["_id"]), "is_active":True})
        return transform_object_list(messages)
    
    if("shared_list" not in session):
        raise HTTPException(status_code=404, detail="Session not found")

    for i in session["shared_list"]:
        if i == current_user["email"]:
            messages = messages_collection.find({"session_id": session_id, "user_id":str(current_user["_id"]), "is_active":True})
            return transform_object_list(messages)
        
    raise HTTPException(status_code=404, detail="Session not found")

@session_controller.get("/{session_id}/messages/export/json")
def export_messages_as_json(session_id: str, current_user: str = Depends(get_current_user)):
    session = sessions_collection.find_one({"_id": ObjectId(session_id), "user_id":str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = messages_collection.find({"session_id": session_id, "user_id":str(current_user["_id"]), "is_active":True})
    json_data = bytes(json.dumps(transform_object_list(messages)).encode('UTF-8'))
    s3_url = upload_misc_to_s3(json_data, filename=f"{session_id}_messages.json")

    return {"s3_url": s3_url}

@session_controller.get("/{session_id}/messages/export/txt")
def export_messages_as_txt(session_id: str, current_user: str = Depends(get_current_user)):
    session = sessions_collection.find_one({"_id": ObjectId(session_id), "user_id":str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = messages_collection.find({"session_id": session_id, "user_id":str(current_user["_id"]), "is_active":True})
    json_data = transform_object_list(messages)
    text_data = ""
    for i in json_data:
        text_data += i["role"] + ":" + i["text"] +"\n\n"

    s3_url = upload_misc_to_s3(bytes(text_data.encode('UTF-8')), filename=f"{session_id}_messages.txt")

    return {"s3_url": s3_url}
    

@session_controller.post("/messages")
def create_message(message: Message = Body(...), current_user: str = Depends(get_current_user)):
    session = sessions_collection.find_one({"_id": ObjectId(message.session_id), "user_id":str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    newMessage = message.dict()
    newMessage["user_id"] = str(current_user["_id"])
    timeNow = datetime.now()
    newMessage["created_at"] = timeNow
    newMessage["updated_at"] = timeNow
    message_id = messages_collection.insert_one(newMessage).inserted_id
    newMessage["_id"] = str(message_id)
    print(newMessage)
    return newMessage

@session_controller.get("/messages/{message_id}", response_model=Message)
def read_message(message_id: str, current_user: str = Depends(get_current_user)):
    message = messages_collection.find_one({"_id": ObjectId(message_id), "user_id":str(current_user["_id"])})
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message.dict()

@session_controller.put("/messages/{message_id}")
def update_message(message_id: str, message = Body(...), current_user: str = Depends(get_current_user)):
    existing_message = messages_collection.find_one({"_id": ObjectId(message_id), "user_id":str(current_user["_id"])})
    if not existing_message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    session = sessions_collection.find_one({"_id": ObjectId(existing_message["session_id"]), "user_id":str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages_collection.update_one({"_id": ObjectId(message_id)}, {"$set": { "is_active": False, "updated_at":datetime.now()}})

    query = {"session_id": existing_message["session_id"], "user_id":str(current_user["_id"]), "created_at":{ "$gte": existing_message["created_at"] }}
    messages_found = messages_collection.find(query)
    print(list(messages_found))
    newvalues = { "$set": { "is_active": False, "updated_at":datetime.now()} }
    updated_message = messages_collection.update_many(query, newvalues)
    
    return {"detail":"updated"}

@session_controller.delete("/messages/{message_id}")
def delete_message(message_id: str, current_user: str = Depends(get_current_user)):
    existing_message = messages_collection.find_one({"_id": ObjectId(message_id), "user_id":str(current_user["_id"])})
    if not existing_message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    session = sessions_collection.find_one({"_id": ObjectId(existing_message["session_id"]), "user_id":str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    query = {"_id": ObjectId(message_id), "user_id":str(current_user["_id"])}
    newvalues = { "$set": { "is_active": False, "updated_at":datetime.now()} }
    updated_message = messages_collection.update_one(query, newvalues)
    
    return transform_object_list([updated_message.raw_result])