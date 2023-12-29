import os
from weaviate import Client

weaviate_client = Client(os.environ.get('WEAVIATE_CONNECTION_STRING'))