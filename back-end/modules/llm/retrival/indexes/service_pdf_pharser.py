from database_clients.weaviate_client import weaviate_client
from database_clients.mongodb_client import mongodb_client
from pdfminer.high_level import extract_text, extract_pages
from weaviate import UnexpectedStatusCodeException
from threading import Event
import re

db = mongodb_client["chat_db"]
processes_collection = db["file_indexing_processes"]

def chunk_text(text, min_word_limit=200, max_word_limit=300):
    chunks = []
    current_chunk = ''
    endSentence = False
    word_count = 0
    
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    for sentence in sentences:
        sentence = sentence.strip()
        words = sentence.split()

        for word in words:
            word_count += 1
            current_chunk += ' ' + word

            if(min_word_limit <= word_count and max_word_limit >= word_count):
                endSentence = True
            elif max_word_limit <= word_count:
                endSentence = False
                chunks.append(current_chunk.strip())
                current_chunk = ""
                word_count = 0

        if(endSentence == True):
            endSentence = False
            chunks.append(current_chunk.strip())
            current_chunk = ""
            word_count = 0

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks

def extract_text_and_tables_from_pdf(pdf_file_path, schema_name, pdf_name="unknown", process_id="", event: Event = None):
    with open(pdf_file_path, 'rb') as pdf_file:        
        # Get the total number of pages in the PDF
        total_pages = len(list(extract_pages(pdf_file)))

        # Iterate through each page and extract the text and tables
        for page_number in range(1, total_pages + 1):
            page_text = str(extract_text(pdf_file, page_numbers=[page_number]))

            # Extract tables from the page
            # tables = tabula.read_pdf(pdf_file_path, pages=page_number)
            percentageCompletion = ((page_number-1)/total_pages)*100
            processes_collection.update_one({"id":process_id},{"$set": {"status":"processing "+pdf_name+" - "+str(percentageCompletion)[0:2]+"%"}})

            # Save the extracted text to the database
            chunked_text = chunk_text(str(page_text))
            if event.is_set():
                    print('The thread was stopped prematurely.')
                    return
            for i in chunked_text:
                if event.is_set():
                    print('The thread was stopped prematurely.')
                    return
                try:
                    uuid = weaviate_client.data_object.create({
                        'content': str(i),
                        'ref': f'{pdf_name} - page: {page_number}',
                    }, schema_name)
                    print(f"Text object created with UUID: {uuid}")
                    
                except UnexpectedStatusCodeException as e:
                    print(f"Error occurred while saving text object: {e}")

def extract_text_from_txt(txt_file_path, schema_name, txt_name="unknown", process_id="", event:Event =None):
    try:
        with open(txt_file_path, 'r', encoding='utf-8') as txt_file:
            text_content = txt_file.read()

            text_chunks = chunk_text(text_content)
            text_chunks_length = len(text_chunks)
            text_chunks_index = 0
            for i in text_chunks:
                if event.is_set():
                    print('The thread was stopped prematurely.')
                    return
                text_chunks_index+=1
                # Save the extracted text to the database
                uuid = weaviate_client.data_object.create({
                    'content': i,
                    'ref': txt_name,
                }, schema_name)
                percentageCompletion = (text_chunks_index/text_chunks_length)*100
                processes_collection.update_one({"id":process_id},{"$set": {"status":"processing "+txt_name+" - "+str(percentageCompletion)[0:2]+"%"}})

                print(f"Text object created with UUID: {uuid}")

    except FileNotFoundError:
        print(f"File not found: {txt_file_path}")
    except Exception as e:
        print(f"Error occurred while processing .txt file: {e}")