from io import BytesIO
from typing import Optional
import matplotlib.pyplot as plt
from langchain.tools.base import BaseTool
from langchain.callbacks.manager import CallbackManagerForToolRun
from modules.file_upload.service_file_upload import upload_image_to_s3_from_byte_data

class excecuteMatplotLibCode(BaseTool):
    """Tool for excecuting matplot lib code"""

    name: str = "plot_graph"
    description: str = """
    Input to this tool is correct code writen in python that plots a graph in matplotlib
    Output to this tool is sending the plot to the human
    Use this tool to send a plot/graph to the human
    example input:

    import matplotlib.pyplot as plt

    x = [1, 2, 3, 4, 5]
    y = [10, 15, 13, 18, 20]

    plt.plot(x, y)
    plt.xlabel('X-axis')
    plt.ylabel('Y-axis')
    plt.title('Sample Matplotlib Plot')
    """

    def save_matplotlib_plot(self, matplotlib_code):
        image_bytes = BytesIO()
        if(matplotlib_code.find("plt.show()") != -1):
            modified_code = matplotlib_code.replace('.show()','.savefig(image_bytes, format="png")\nplt.close()')
        else:
            matplotlib_code += "\nplt.savefig(image_bytes, format='png')\nplt.close()"
        print("printed:",modified_code)
        try:
            exec(modified_code)
        except:
            return -1
        return image_bytes.getvalue()

    def _run(
        self,
        query: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        """Execute the query, return the results or an error message."""
        matplotlib_code = query
        image_bytes = self.save_matplotlib_plot(matplotlib_code)
        if(image_bytes == -1):
            return "code was not correct, try again"
        plt.close('all')
        url = upload_image_to_s3_from_byte_data(image_bytes)
        return "here is the image url for the plot, give it to the human: "+url