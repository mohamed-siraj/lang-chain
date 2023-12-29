import os
from pymongo import MongoClient

mongodb_client = MongoClient(os.environ.get('MONGODB_CONNECTION_STRING'))