from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.responses import HTMLResponse
from fastapi.openapi.models import Response
from database_clients.mongodb_client import mongodb_client
from modules.llm.agents.dashboards.model_dashboards import Dashboard, DashboardInDB
from modules.auth.service_jwt import get_current_user
from bson import ObjectId
from typing import List

db = mongodb_client["dashboard_db"]
collection = db["dashboards"]

dashboards_controller = FastAPI()

@dashboards_controller.post("/", response_model=DashboardInDB)
def create_dashboard(dashboard: Dashboard, current_user=Depends(get_current_user)):
    dashboard_obj = dashboard.dict()
    dashboard_obj["user_id"] = current_user["_id"]
    result = collection.insert_one(dashboard_obj)
    return {**dashboard.dict(), "id": result.inserted_id}


@dashboards_controller.get("/{dashboard_id}", response_model=DashboardInDB)
def read_dashboard(dashboard_id: str, current_user=Depends(get_current_user)):
    dashboard = collection.find_one({"_id": ObjectId(dashboard_id), "user_id": current_user["_id"]})
    if dashboard:
        return {**dashboard, "id": str(dashboard["_id"])}
    raise HTTPException(status_code=404, detail="Dashboard not found")


@dashboards_controller.put("/{dashboard_id}", response_model=DashboardInDB)
def update_dashboard(dashboard_id: str, updated_dashboard: Dashboard, current_user=Depends(get_current_user)):
    result = collection.update_one(
        {"_id": ObjectId(dashboard_id), "user_id": current_user["_id"]},
        {"$set": updated_dashboard.dict()},
    )
    if result.modified_count == 1:
        return {**updated_dashboard.dict(), "id": dashboard_id}
    raise HTTPException(status_code=404, detail="Dashboard not found")


@dashboards_controller.get("/{dashboard_id}/html", response_class=HTMLResponse)
def serve_dashboard_html(dashboard_id: str):
    dashboard = collection.find_one({"_id": ObjectId(dashboard_id)})
    if dashboard:
        return HTMLResponse(content=dashboard["html"])
    raise HTTPException(status_code=404, detail="Dashboard not found")


@dashboards_controller.delete("/{dashboard_id}", response_model=Response)
def delete_dashboard(dashboard_id: str, current_user=Depends(get_current_user)):
    result = collection.delete_one({"_id": ObjectId(dashboard_id), "user_id": current_user["_id"]})
    if result.deleted_count == 1:
        return {"status": "success", "message": "Dashboard deleted"}
    raise HTTPException(status_code=404, detail="Dashboard not found")
