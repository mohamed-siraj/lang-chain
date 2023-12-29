
from bson import ObjectId
from pydantic import BaseModel

class Dashboard(BaseModel):
    html: str = ""
    dashboard_definition: str = "{}"
    user_id: str = "none"

class DashboardInDB(Dashboard):
    id: str