import pandas as pd
from database_clients.mongodb_client import mongodb_client
from fastapi import Depends, FastAPI, HTTPException, File, UploadFile
from modules.llm.agents.excel.model_excel import Excel
from modules.auth.service_jwt import get_current_user
from modules.file_upload.service_file_upload import upload_file_to_s3
from typing import List
import os

db = mongodb_client["chat_db"]
excel_collection = db["excel"]

excel_controller = FastAPI()

UPLOAD_PATH = "./"

def addUserToSheetName(sheetname, current_user):
    return sheetname.split(".")[0]+"_"+str(current_user["_id"])+"."+sheetname.split(".")[1]

@excel_controller.post("/")
async def create_sheet(excel_sheet: UploadFile = File(...), current_user = Depends(get_current_user)):

    sheet_data = excel_collection.find_one({"sheet_name": addUserToSheetName(excel_sheet.filename, current_user),"user_id":str(current_user["_id"])})
    if sheet_data:
        return {"message":"sheet already exists"}
    
    file_name = addUserToSheetName(excel_sheet.filename, current_user)
    file_path = os.path.join(UPLOAD_PATH, file_name)
    
    with open(file_path, "wb") as f:
        f.write(excel_sheet.file.read())
    
    try:
        s3_url = upload_file_to_s3(file_path, os.environ.get('S3_BUCKET_NAME'), f"excel_sheets/{file_name}")
    except:
        raise HTTPException(status_code=400, detail="Sheet object could not be created")
    
    try:
        os.remove(file_path)
    except:
        raise HTTPException(status_code=400, detail="Sheet object could not be deleted")
    
    try:
        print(s3_url)
        df = pd.read_csv(s3_url)
    except:
        raise HTTPException(status_code=400, detail="Sheet is not valid")
    
    sheet_data = Excel(sheet_name=file_name, user_id=str(current_user["_id"]), original_sheet_name=str(excel_sheet.filename), url=s3_url)
    inserted_sheet = excel_collection.insert_one(sheet_data.dict())
    sheet_data_output = sheet_data.dict()
    sheet_data_output["_id"] = str(inserted_sheet.inserted_id)
    return sheet_data_output

@excel_controller.get("/{sheet_name}", response_model=Excel)
def read_sheet(sheet_name: str, current_user = Depends(get_current_user)):
    sheet_data = excel_collection.find_one({"sheet_name": addUserToSheetName(sheet_name, current_user),"user_id":str(current_user["_id"])})
    if not sheet_data:
        raise HTTPException(status_code=404, detail="Sheet not found")
    
    return sheet_data

@excel_controller.get("/", response_model=List[Excel])
def get_all_sheets(current_user = Depends(get_current_user)):
    sheets = excel_collection.find({"user_id":str(current_user["_id"])})
    return [sheet for sheet in sheets]

@excel_controller.delete("/{sheet_name}", response_model=Excel)
def delete_sheet(sheet_name: str, current_user = Depends(get_current_user)):
    sheet_data = excel_collection.find_one({"sheet_name": addUserToSheetName(sheet_name, current_user),"user_id":str(current_user["_id"])})
    if not sheet_data:
        raise HTTPException(status_code=404, detail="Sheet not found")
    
    excel_collection.delete_one({"sheet_name": addUserToSheetName(sheet_name, current_user), "user_id":str(current_user["_id"])})
    
    return sheet_data
