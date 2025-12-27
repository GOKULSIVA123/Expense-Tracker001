
from app import get_db
import os
from dotenv import load_dotenv
from bson import ObjectId
import certifi
from pymongo import MongoClient
import datetime

load_dotenv()
uri = os.getenv("MONGO_URI")
# client = MongoClient(uri, tlsCAFile=certifi.where())

# print(client.list_database_names())

def serialize_doc(doc):
    if doc is None:
        return None
    doc['_id']=str(doc['_id'])
    for key,value in doc.items():
        if isinstance(value, datetime.datetime):
            doc[key]=value.isoformat()
    return doc

def insert_new_expense(user_id,title,amount,category,date_str,notes):
    db=get_db()
    try:
        date_obj=datetime.datetime.strptime(date_str,"%Y-%m-%d")
    except (ValueError,TypeError):
        date_obj = datetime.datetime.utcnow()
    expense_doc={
        "user_id":user_id,
        "title":title,
        "amount":amount,
        "category":category,
        "date":date_obj,
        "notes":notes,
        "created_at": datetime.datetime.utcnow()
    }
    result=db.expenses.insert_one(expense_doc)
    new_doc=db.expenses.find_one({"_id":result.inserted_id})
    return serialize_doc(new_doc)
def get_new_expenses(user_id):
    db=get_db()
    data1=db.expenses.find({"user_id":user_id}).sort("date",-1)
    return [serialize_doc(i) for i in data1]

def update_expense(user_id, expense_id, update_data):
    """
    Updates an existing expense, ensuring user ownership.
    """
    db = get_db()
    
    if "_id" in update_data: del update_data["_id"]
    if "user_id" in update_data: del update_data["user_id"]
    
    if 'date' in update_data:
        try:
            update_data['date'] = datetime.datetime.strptime(update_data['date'], "%Y-%m-%d")
        except:
            pass

    result = db.expenses.update_one(
        {"_id": ObjectId(expense_id), "user_id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        return None
        
    updated_doc = db.expenses.find_one({"_id": ObjectId(expense_id)})
    return serialize_doc(updated_doc)


def delete_expense(user_id, expense_id):
    """
    Deletes an expense, ensuring user ownership.
    """
    db = get_db()
    result = db.expenses.delete_one({
        "_id": ObjectId(expense_id), 
        "user_id": user_id
    })
    return result.deleted_count > 0

def get_expense(user_id, expense_id):
    db=get_db()
    try:
        doc = db.expenses.find_one({"_id": ObjectId(expense_id), "user_id": user_id})
        return serialize_doc(doc)
    except:
        return None

def upsert_preferences(user_id, preferences_data):
    db = get_db()
    
    # Ensure date is stored as datetime if present
    if 'target_date' in preferences_data:
        try:
             # If it comes as string, parse it. If it's already datetime, leave it.
            if isinstance(preferences_data['target_date'], str):
                preferences_data['target_date'] = datetime.datetime.strptime(preferences_data['target_date'], "%Y-%m-%d")
        except:
            pass
            
    # Add/Update 'updated_at'
    preferences_data['updated_at'] = datetime.datetime.utcnow()

    result = db.preferences.update_one(
        {"user_id": user_id},
        {"$set": preferences_data},
        upsert=True
    )
    
    updated_doc = db.preferences.find_one({"user_id": user_id})
    return serialize_doc(updated_doc)


def get_preferences(user_id):
    db = get_db()
    doc = db.preferences.find_one({"user_id": user_id})
    return serialize_doc(doc)

def get_dashboard_stats(user_id):
    db = get_db()
    
    # 1. Monthly Spending breakdown by Category
    pipeline_monthly = [
        {"$match": {"user_id": user_id}},
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$date"},
                    "month": {"$month": "$date"},
                    "category": "$category"
                },
                "total": {"$sum": "$amount"}
            }
        },
        {"$sort": {"_id.year": -1, "_id.month": -1}}
    ]
    
    stats_data = list(db.expenses.aggregate(pipeline_monthly))
    
    formatted_stats = []
    for item in stats_data:
        year = item["_id"]["year"]
        month = item["_id"]["month"]
        cat = item["_id"]["category"]
        formatted_stats.append({
            "month": f"{year}-{month:02d}", 
            "category": cat,
            "total": item["total"]
        })

    # 2. Total spending by Category (Pie Chart)
    pipeline_category = [
        {"$match": {"user_id": user_id}},
        {"$group": {"_id": "$category", "total": {"$sum": "$amount"}}},
        {"$sort": {"total": -1}}
    ]
    category_data = list(db.expenses.aggregate(pipeline_category))
    formatted_category = [{"category": item["_id"], "total": item["total"]} for item in category_data]

    return {
        "monthly_breakdown": formatted_stats,
        "category_totals": formatted_category
    }

def set_monthly_budget(user_id, month, amount):
    # month format: "YYYY-MM"
    db = get_db()
    db.budgets.update_one(
        {"user_id": user_id, "month": month},
        {"$set": {"limit": float(amount), "updated_at": datetime.datetime.utcnow()}},
        upsert=True
    )
    return {"message": f"Budget set for {month}"}

def get_budget_status(user_id, date_obj):
    """
    Checks if the budget for the month of the given date is exceeded.
    """
    db = get_db()
    month_str = date_obj.strftime("%Y-%m") # "2023-12"
    
    # Get Budget
    budget_doc = db.budgets.find_one({"user_id": user_id, "month": month_str})
    if not budget_doc:
        return None 
        
    limit = budget_doc.get("limit", 0)
    
    # Calculate total spend for this month
    start_date = datetime.datetime(date_obj.year, date_obj.month, 1)
    if date_obj.month == 12:
        end_date = datetime.datetime(date_obj.year + 1, 1, 1)
    else:
        end_date = datetime.datetime(date_obj.year, date_obj.month + 1, 1)
        
    pipeline = [
        {
            "$match": {
                "user_id": user_id,
                "date": {"$gte": start_date, "$lt": end_date}
            }
        },
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    
    result = list(db.expenses.aggregate(pipeline))
    total_spent = result[0]["total"] if result else 0
    
    return {
        "month": month_str,
        "limit": limit,
        "total_spent": total_spent,
        "exceeded": total_spent > limit
    }

