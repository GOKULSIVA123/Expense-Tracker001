from app import get_db
def insert_gokul_data():
    db = get_db()
    users_collection = db.users # Targeting a 'users' collection
    
    # 1. Call the function to get the document (dictionary)
    user_document = {"name":"gokulsiva","clg":"sec"}
    
    # 2. Insert the document using PyMongo
    result = users_collection.insert_one(user_document)
    
    print(f"Document inserted with ID: {result.inserted_id}")
    return str(result.inserted_id)