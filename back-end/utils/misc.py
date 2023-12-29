import json
from bson import json_util
import hashlib

def transform_object_list(data):
    data = json.loads(json_util.dumps(list(data)))
    transformed_data = [
        {key: value['$oid'] if isinstance(value, dict) and '$oid' in value else value for key, value in item.items()}
        for item in data
    ]
    return transformed_data

def string_to_hash(stringObj):
    return hashlib.md5(str(stringObj).encode()).hexdigest()