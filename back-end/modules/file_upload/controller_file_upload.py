from fastapi import Depends, FastAPI, File, UploadFile
from modules.auth.service_jwt import get_current_user
from fastapi.responses import JSONResponse
from utils.misc import string_to_hash
from modules.file_upload.service_file_upload import upload_image_to_s3_from_byte_data

file_upload_controller = FastAPI()

@file_upload_controller.post("/images")
async def upload_image(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    
    if not file.content_type.startswith("image"):
        return JSONResponse(content={"error": "Not an image file."}, status_code=400)
    
    object_name = str(current_user["_id"]) + string_to_hash(file.filename) +"."+file.filename.split(".")[-1]
    url = upload_image_to_s3_from_byte_data(file.file.read(), object_name)

    return JSONResponse(content={"url": url}, status_code=200)
