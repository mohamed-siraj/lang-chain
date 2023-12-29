import json
import os
from typing import List, Optional
from langchain.tools.base import BaseTool
from langchain.callbacks.manager import CallbackManagerForToolRun
from pydantic import BaseModel
from bokeh.layouts import row
from bokeh.models import ColumnDataSource
from bokeh.plotting import figure
from bokeh.resources import CDN
from bokeh.embed import file_html
from modules.llm.agents.dashboards.controller_dashboards import read_dashboard, create_dashboard, update_dashboard
from modules.llm.agents.dashboards.model_dashboards import Dashboard

class ChartData(BaseModel):
    x: List[str]
    y: List[str]

class DashboardArgs(BaseModel):
    dashboard_id: str
    title: str
    type_of_chart: str
    data: ChartData

class dashboardingLLM(BaseTool):
    """Tool for editing dashboards"""

    current_user:dict = None

    def __init__(self, current_user):
        super().__init__()
        self.current_user = current_user

    name: str = "create_or_edit_dashboard"
    description: str = """
    This tool allows you to create or edit a dashboards. 
    This tool expects an input that contains the data for the chart, the type of chart and the dashboard id. 
    To create a new dashboard leave the dashboard id blank.
    The inputs must be json data that has already been resolved.

    example inputs:
    bar chart example:
    {
        "dashboard_id": 657e6209085fc947f78abd02
        "title": "example graph"
        "type_of_chart": "bar_chart"
        "data": {
            "x":["A","B","C","D"],
            "y":[1,2,3,4]
        }
    } 

    line chart example:
    {
        dashboard_id: 657e6209085fc947f78abd02
        title: "example graph"
        type_of_chart: "line_chart"
        data: {
            x:[4,3,2,1],
            y:[1,2,3,4]
        }
    }
    """

    def _parse_input(
        self,
        tool_input,
    ):
        """Convert tool input to pydantic model."""
        print("INPUTTSS:",tool_input)
        print("INPUTTSS TYPE:",type(tool_input))
        return str(tool_input)

    def _run(
        self,
        query,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        """Execute the query, return the results or an error message."""
        print("QUERY:",query)
        print("TYPE:",type(query))
        
        data = json.loads(query.replace("'",'"'))
        

        if "dashboard_id" in data:
            dashboard_id = data["dashboard_id"]
            existing_dashboard = read_dashboard(dashboard_id, self.current_user)

            existing_dashboard_plot = create_dashboard_from_definition(json.loads(existing_dashboard["dashboard_definition"]))

            plot = create_plot_from_definition(data)
            dashboard = addPlotToDashboard(plot, existing_dashboard_plot)
            html = file_html(dashboard, CDN, "bokeh_chart01")
            print("rawrr:", html)

            # updating definition
            dashboard_definition = json.loads(existing_dashboard["dashboard_definition"])
            dashboard_definition["charts"].append(json.dumps(data))

            # update html file and definition
            updated_dashboard = Dashboard(html=str(html), dashboard_definition=json.dumps(dashboard_definition))
            update_dashboard(dashboard_id=dashboard_id, updated_dashboard=updated_dashboard, current_user=self.current_user)
            return f"dashboard created, you can find the created dashboard at this url: {os.environ.get('API_BASE_URL') or 'http://127.0.0.1:8000'}/api/v1/dashboards/{dashboard_id}/html"
        
        plot = create_plot_from_definition(data)
        dashboard = addPlotToDashboard(plot)
        html = file_html(dashboard, CDN, "bokeh_chart01")

        # creating dashboard definition
        dashboard_definition = {
            "charts":[data]
        }

        # create new dashboard
        dashboard_data = Dashboard(html=str(html), dashboard_definition=json.dumps(dashboard_definition))
        dashboard_data = create_dashboard(dashboard=dashboard_data, current_user=self.current_user)
        dashboard_id = str(dashboard_data["id"])
        return f"dashboard created, you can find the created dashboard at this url: {os.environ.get('API_BASE_URL') or 'http://127.0.0.1:8000'}/api/v1/dashboards/{dashboard_id}/html"

class ViewDashboard(BaseTool):
    """Tool for viewing dashboards"""

    current_user:dict = None

    def __init__(self, current_user):
        super().__init__()
        self.current_user = current_user

    name: str = "create_or_edit_dashboard"
    description: str = """
    This tool allows you to view a dashboard by giving it's id as an input
    input example: {"dashboard_id":"657e6209085fc947f78abd02"}
    """

    def _parse_input(
        self,
        tool_input,
    ):
        """Convert tool input to pydantic model."""
        print("INPUTTSS:",tool_input)
        print("INPUTTSS TYPE:",type(tool_input))
        return str(tool_input)

    def _run(
        self,
        query,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        """Execute the query, return the results or an error message."""
        print("QUERY:",query)
        print("TYPE:",type(query))
        
        data = json.loads(query.replace("'",'"'))
        dashboard_id = data["dashboard_id"]
        existing_dashboard = read_dashboard(dashboard_id, self.current_user)
        
        return f"dashboard json: {json.dumps(existing_dashboard)}"
    
class DeleteDashboardGraph(BaseTool):
    """Tool for viewing dashboards"""

    current_user:dict = None

    def __init__(self, current_user):
        super().__init__()
        self.current_user = current_user

    name: str = "create_or_edit_dashboard"
    description: str = """
    This tool allows you to delete a graph in a dashboard by giving the dashboard id and the graph's index as an input
    input example: {"dashboard_id":"657e6209085fc947f78abd02", "graph_index":0}
    """

    def _parse_input(
        self,
        tool_input,
    ):
        """Convert tool input to pydantic model."""
        print("INPUTTSS:",tool_input)
        print("INPUTTSS TYPE:",type(tool_input))
        return str(tool_input)

    def _run(
        self,
        query,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        """Execute the query, return the results or an error message."""
        print("QUERY:",query)
        print("TYPE:",type(query))
        
        data = json.loads(query.replace("'",'"'))
        dashboard_id = data["dashboard_id"]
        existing_dashboard = read_dashboard(dashboard_id, self.current_user)
        
        return f"dashboard json: {json.dumps(existing_dashboard)}"


def create_scatter_plot(source, title="blank"):
    plot = figure( tools="pan,box_zoom,reset",  title=title)
    plot.scatter(x='x', y='y', source=ColumnDataSource(data=source))
    return plot

def create_line_plot(source, title="blank"):
    plot = figure( tools="pan,box_zoom,reset",  title=title)
    plot.line(x='x', y='y', source=ColumnDataSource(data=source), line_width=2, line_color="orange")
    return plot

def create_bar_chart(source, title="blank"):
    source = ColumnDataSource(data=source)
    plot = figure(tools="pan,box_zoom,reset", title=title, x_range=source.data['x'])
    plot.vbar(x='x', top='y', width=0.9, source=source, line_color="white", fill_color="blue")
    return plot

def addPlotToDashboard(plot, dashboard = row()):
    dashboard = row(dashboard, plot)
    return dashboard

def create_plot_from_definition(plotDefinition):
    plot_created = None
    if(plotDefinition["type_of_chart"]=="bar_chart"):
        plot_created = create_bar_chart(plotDefinition["data"], plotDefinition["title"])
    elif(plotDefinition["type_of_chart"]=="line_chart"):
        plot_created = create_line_plot(plotDefinition["data"], plotDefinition["title"])
    elif(plotDefinition["type_of_chart"]=="scatter_chart"):
        plot_created = create_scatter_plot(plotDefinition["data"], plotDefinition["title"])
    return plot_created

def create_dashboard_from_definition(dashboardDefinition):
    charts = dashboardDefinition["charts"]
    dashboard = row()
    for chart in charts:
        plot_created = create_plot_from_definition(chart)
        dashboard = addPlotToDashboard(plot_created, dashboard)
    return dashboard

exampleDashboard = {
    "id":"01",
    "charts":[
        {
            "title": "example graph",
            "type_of_chart": "line_chart",
            "data": {
                "x":[4,3,2,1],
                "y":[1,2,3,4]
            }
        },
        {
            "title": "example graph 02",
            "type_of_chart": "bar_chart",
            "data": {
                "x":["A","B","C","D"],
                "y":[1,2,3,4]
            }
        }
    ]
}

# dash = create_dashboard_from_definition(exampleDashboard)
# show(dash)

# print(type(dict(x=[1,2,3,4], y=[1,2,3,4])))
# print(type(exampleDashboard["charts"][0]["data"]))

