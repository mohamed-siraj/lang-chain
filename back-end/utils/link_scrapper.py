from langchain.callbacks.manager import (AsyncCallbackManagerForToolRun, CallbackManagerForToolRun)
from langchain.tools import BaseTool
from bs4.element import Comment
from bs4 import BeautifulSoup
from typing import Optional
import requests

def tag_visible(element):
    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
        return False
    if isinstance(element, Comment):
        return False
    return True

def text_from_html(soup):
    texts = soup.findAll(string=True)
    visible_texts = filter(tag_visible, texts)  
    return u" ".join(t.strip() for t in visible_texts)

def scrape_text_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check for any HTTP errors

        soup = BeautifulSoup(response.content, 'html.parser')
        table_elements = soup.find_all('table')   # Find all table elements
        code_elements = soup.find_all('code')     # Find all code elements
        
        extracted_text = text_from_html(soup)

        extracted_tables = []
        for table in table_elements:
            extracted_table = ""
            rows = table.find_all('tr')
            for row in rows:
                cells = row.find_all(['th', 'td'])
                row_text = ' | '.join(cell.get_text(strip=True) for cell in cells)
                extracted_table += row_text+"\n"
            extracted_tables.append(extracted_table)
        
        extracted_code = []
        for code_block in code_elements:
            extracted_code.append(code_block.get_text(strip=True))

        return extracted_text, extracted_tables, code_elements

    except requests.exceptions.RequestException as e:
        print("Error:", e)

class getUrl(BaseTool):
    name = "custom_search"
    description = "useful for when you need to answer questions based on a url. this tool returns the contents of a url. Just input the Url and get the content"
    
    def _run(
        self, query: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool."""
        try:
            output = scrape_text_from_url(query)
            return output
        except:
            return "url doesn't seem to work"
         

    async def _arun(
        self, query: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("custom_search does not support async")