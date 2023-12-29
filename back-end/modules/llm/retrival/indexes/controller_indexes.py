from weaviate.exceptions import UnexpectedStatusCodeException
from database_clients.weaviate_client import weaviate_client
from fastapi import Body, Depends, FastAPI, File, HTTPException, UploadFile
from langchain.text_splitter import TokenTextSplitter

from modules.llm.retrival.indexes.service_pdf_pharser import extract_text_from_txt, extract_text_and_tables_from_pdf
from modules.llm.retrival.indexes.model_indexes import CreateObjectFromUrlDto, Indexes
from database_clients.mongodb_client import mongodb_client
from utils.link_scrapper import scrape_text_from_url
from modules.auth.service_jwt import get_current_user
from utils.misc import transform_object_list

from threading import Event
from typing import List
import threading
import hashlib
import random
import os


indexes_controller = FastAPI()

text_splitter = TokenTextSplitter(chunk_size=100, chunk_overlap=20)

eventsRunning = {}

db = mongodb_client["chat_db"]
index_collection = db["indexes"]
processes_collection = db["file_indexing_processes"]

@indexes_controller.get("/")
async def get_indexes(current_user: str = Depends(get_current_user)):
    try:
        indexes = index_collection.find({"user_id":str(current_user["_id"])})
        return transform_object_list(indexes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@indexes_controller.post("/")
def create_index(index:Indexes, current_user: str = Depends(get_current_user)):
    try:
        indexObj = {
            "class": index.index_name,
            "properties": [
                {
                    "dataType": ["text"],
                    "name": "content"
                },
                {
                    "dataType": ["text"],
                    "name": "ref"
                }
            ],
            "vectorizer": "text2vec-openai"
        }
        weaviate_client.schema.create_class(indexObj)

        newIndex = index.dict() 
        newIndex["user_id"] = str(current_user["_id"])
        index_collection.insert_one(newIndex)

        return {"message": f"Index '{index.index_name}' created successfully!"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error:"+str(e))
    
@indexes_controller.get("/{index_name}")
async def get_index_data(index_name: str, current_user: str = Depends(get_current_user)):
    try:
        indexes = index_collection.find({"user_id":str(current_user["_id"]), "index_name":index_name})
        length = len(list(indexes))
        if(length==0):return {"message": f"Index Not Found"}

        response = weaviate_client.schema.get(index_name)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@indexes_controller.delete("/{index_name}")
def delete_index(index_name: str, current_user: str = Depends(get_current_user)):
    try:
        indexes = index_collection.find({"user_id":str(current_user["_id"]), "index_name":index_name})
        length = len(list(indexes))
        if(length==0):return {"message": f"Index Not Found"}

        weaviate_client.schema.delete_class(index_name)
        index_collection.delete_one({"index_name":index_name})
        return {"message": f"Index '{index_name}' deleted successfully!"}
        
    except (UnexpectedStatusCodeException):
        raise HTTPException(status_code=500, detail="Unable to connect to Weaviate server")

# CRUD for schema objects

#search for object
@indexes_controller.get("/{index_name}/search")
def search_object(index_name: str, query_phrase:str="", current_user: str = Depends(get_current_user)):
    try:
        indexes = index_collection.find({"user_id":str(current_user["_id"]), "index_name":index_name})
        length = len(list(indexes))
        if(length==0):return {"message": f"Index Not Found"}
        
        prop_arr = ["content","ref"]

        if(query_phrase!=""):
            response = (
                weaviate_client.query
                .get(index_name, prop_arr)
                .with_near_text({"concepts": [str(query_phrase)]})
                .with_additional(["id"])
                .do()
            )
            return {"result": response}
        else:
            response = weaviate_client.query.get(index_name, [property]).with_additional(["id"]).do()
            return {"result": response}
        

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Unable to connect to Weaviate server")
    
@indexes_controller.post("/{index_name}")
def add_object(index_name: str, obj: dict, current_user: str = Depends(get_current_user)):
    try:
        print(obj)
        if(not obj.has_key("ref")): obj["ref"] = "User"
        indexes = index_collection.find({"user_id":str(current_user["_id"]), "index_name":index_name})
        length = len(list(indexes))
        if(length==0):return {"message": f"Index Not Found"}

        response = weaviate_client.data_object.create(obj,index_name)
        return {"message": "Object added successfully!", "object_id": response}
    except (UnexpectedStatusCodeException):
        raise HTTPException(status_code=500, detail="Unable to connect to Weaviate server")
    
# @indexes_controller.post("/{index_name}/add_text")
def add_text_recursivly_to_weaviate(index_name: str, text: str, ref:str, current_user: str = Depends(get_current_user)):
    try:
        indexes = index_collection.find({"user_id":str(current_user["_id"]), "index_name":index_name})
        length = len(list(indexes))
        if(length==0):return {"message": f"Index Not Found"}

        # Use the recursive text splitter to split the input text
        texts = text_splitter.split_text(text)

        created_Ids = []
        for i in texts:
            instance = {
                "content": i,
                "ref": ref
            }
            created_Ids.append(weaviate_client.data_object.create(instance,index_name))
        
        return {"message": "Text added to Weaviate successfully!", "object_ids": created_Ids}
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Unable to connect to Weaviate server")
    
@indexes_controller.post("/{index_name}/read_url")
def add_data_from_link(index_name: str, body: CreateObjectFromUrlDto = Body(...), current_user: str = Depends(get_current_user)):
    try:
        indexes = index_collection.find({"user_id":str(current_user["_id"]), "index_name":index_name})
        length = len(list(indexes))
        if(length==0):return {"message": f"Index Not Found"}

        text, tables, code  = scrape_text_from_url(body.url)
        return add_text_recursivly_to_weaviate(index_name, text, body.url, current_user)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Unable to connect to Weaviate server")
    
@indexes_controller.post("/read_url/")
def create_link_data_index(body: CreateObjectFromUrlDto = Body(...), current_user: str = Depends(get_current_user)):
    try:
        url = str(body.url)
        urlIdUnencoded = str(str(current_user["_id"]) + str(url) + str(random.randint(0,9999999999)))
        id = "a"+hashlib.md5(urlIdUnencoded.encode()).hexdigest()

        create_index(index=Indexes(index_name=id, name=url),current_user=current_user)

        text, tables, code  = scrape_text_from_url(body.url)
        data = add_text_recursivly_to_weaviate(id, text, body.url, current_user)
        return {"index":id, "index_name":url, "additional":data}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Unable to connect to Weaviate server")


@indexes_controller.delete("/{index_name}/{object_id}")
def remove_object(index_name: str, object_id: str, current_user: str = Depends(get_current_user)):
    try:
        indexes = index_collection.find({"user_id":str(current_user["_id"]), "index_name":index_name})
        length = len(list(indexes))
        if(length==0):return {"message": f"Index Not Found"}

        weaviate_client.data_object.delete(object_id, index_name)
        return {"message": "Object removed successfully!"}
    except (UnexpectedStatusCodeException):
        raise HTTPException(status_code=500, detail="Unable to connect to Weaviate server")

@indexes_controller.put("/{index_name}/{object_id}")
def edit_object(index_name: str, object_id: str, obj: dict, current_user: str = Depends(get_current_user)):
    try:
        indexes = index_collection.find({"user_id":str(current_user["_id"]), "index_name":index_name})
        length = len(list(indexes))
        if(length==0):return {"message": f"Index Not Found"}

        weaviate_client.data.update(index_name, object_id, obj)
        return {"message": "Object updated successfully!"}
    except (UnexpectedStatusCodeException):
        raise HTTPException(status_code=500, detail="Unable to connect to Weaviate server")

@indexes_controller.post("/{index_name}/multifile")
async def process_pdfs(index_name: str, pdf_files: List[UploadFile] = File(...), current_user: str = Depends(get_current_user)):
    try:
        indexes = index_collection.find({"user_id":str(current_user["_id"]), "index_name":index_name})
        length = len(list(indexes))
        if(length==0):return {"message": f"Index Not Found"}

        object_id = hashlib.md5(str(str(current_user["_id"])+"_"+str(index_name)+"_"+str(random.randint(0,9999999999))).encode()).hexdigest()

        processInformation = {"id":object_id,"files_to_process":[], "user_id":str(current_user["_id"]), "index_name":index_name}

        for pdf_file in pdf_files:
            
            extension = pdf_file.filename.split(".")[-1]
            print(extension)
            if(not (extension=="pdf" or extension =="txt")):
                return HTTPException(status_code=500, detail="extension type not supported")
            
            fileName = str(str(current_user["_id"]) + str(random.randint(0,9999999999)))
            fileName = hashlib.md5(fileName.encode()).hexdigest()+"."+extension

            # Save each uploaded PDF to a temporary file        
            with open(fileName, "wb") as temp_file:
                temp_file.write(pdf_file.file.read())
                processInformation["files_to_process"].append({"file":fileName, "file_name":pdf_file.filename})

        processInformationCopy = dict(processInformation)
        event = Event()
        eventsRunning[object_id] = event
        threading.Thread(target=createProcess, args=(processInformationCopy,event,)).start() 
        print(processInformation)
        return processInformation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@indexes_controller.post("/multifile/")
async def create_pdf_indexs(pdf_files: List[UploadFile] = File(...), current_user: str = Depends(get_current_user)):
    try:
        processes_created = []
        for pdf_file in pdf_files:
            extension = pdf_file.filename.split(".")[-1]
            fileIdUnencoded = str(str(current_user["_id"]) + str(random.randint(0,9999999999)))
            processIdUnencoded = str(fileIdUnencoded+str(random.randint(0,9999999999)))
            file_id = "a"+hashlib.md5(fileIdUnencoded.encode()).hexdigest()
            process_id = hashlib.md5(processIdUnencoded.encode()).hexdigest()

            file_name_encoded = file_id+"."+extension
            index_name = file_id

            create_index(index=Indexes(index_name=index_name, name=pdf_file.filename),current_user=current_user)
            
            if(not (extension=="pdf" or extension =="txt")):
                return HTTPException(status_code=500, detail="extension type not supported")
            
            processInformation = {"id":process_id,"files_to_process":[], "user_id":str(current_user["_id"]), "index_name":index_name}

            # Save each uploaded PDF to a temporary file
            with open(file_name_encoded, "wb") as temp_file:
                temp_file.write(pdf_file.file.read())
                processInformation["files_to_process"].append({"file":file_name_encoded, "file_name":pdf_file.filename})

            processInformationCopy = dict(processInformation)
            processes_created.append(processInformation)
            event = Event()
            eventsRunning[process_id] = event
            threading.Thread(target=createProcess, args=(processInformationCopy,event,)).start()
        return processes_created
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@indexes_controller.get("/process/status/{process_id}")
async def get_process_status(process_id: str, current_user: str = Depends(get_current_user)):
    process = processes_collection.find_one({"id":process_id, "user_id":str(current_user["_id"])})
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
    return transform_object_list([process])[0]

@indexes_controller.post("/process/kill/{process_id}")
async def get_process_status(process_id: str, current_user: str = Depends(get_current_user)):
    process = processes_collection.find({"id":process_id, "user_id":str(current_user["_id"])})
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
    processes_collection.update_one({"id":process_id},{"$set": {"status":"killed", "is_active":False}})
    try:
        eventsRunning[process_id].set()
    except:
        print(eventsRunning)
        print("no process to kill")

    return transform_object_list(process)[0]

@indexes_controller.get("/process/status/")
async def get_prcoesses_status(current_user: str = Depends(get_current_user)):
    process = processes_collection.find({"user_id":str(current_user["_id"])})
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
    return transform_object_list(process)

@indexes_controller.get("/process/status/in-progress/")
async def get_prcoesses_status(current_user: str = Depends(get_current_user)):
    process = processes_collection.find({"user_id":str(current_user["_id"]), "is_active":True})
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
    return transform_object_list(process)
    

def createProcess(process_details, event: Event):
    # creates database object saying the process is alive
    process_details["status"] = "processing"
    process_details["is_active"] = True
    processes_collection.insert_one(process_details)

    # starts process
    for file in process_details["files_to_process"]:
        processes_collection.update_one({"id":process_details["id"]},{"$set": {"status":"processing "+file["file_name"]}})
        extension = file["file_name"].split(".")[-1]
        if event.is_set():
            print('The thread was stopped prematurely.')
            return
        if( extension == "pdf"):
            extract_text_and_tables_from_pdf(file["file"], process_details["index_name"], file["file_name"], process_details["id"], event)
        elif(extension == "txt"):
            extract_text_from_txt(file["file"], process_details["index_name"], file["file_name"], process_details["id"], event)

        os.remove(file["file"])
        
    # writes process as done
    processes_collection.update_one({"id":process_details["id"]},{"$set": {"status":"done", "is_active":False}})