# routes.py
from flask import Blueprint, jsonify, request
from auth import token_required
from models import (
    insert_new_expense, get_new_expenses, get_expense, 
    update_expense, delete_expense, upsert_preferences, get_preferences,
    get_dashboard_stats, set_monthly_budget, get_budget_status
)
from ai_services import generate_financial_report
import os
import datetime

routes = Blueprint("routes", __name__)

@routes.route("/api/me", methods=["GET"])
@token_required
def me():
    return jsonify({"user_id": request.user_id}), 200

# ---------------------------------------------------------------------------
# 1. POST Expenses: Log Transaction (With Budget Alert)
# ---------------------------------------------------------------------------
@routes.route("/api/expenses", methods=["POST"])
@token_required
def create_expense():
    data = request.json
    title = data.get("title")
    amount = data.get("amount")
    category = data.get("category")
    date_str = data.get("date")
    notes = data.get("notes", "")
    
    # Basic validation
    if not (title and amount and date_str and category):
        return jsonify({"error": "Missing required fields"}), 400
        
    result = insert_new_expense(request.user_id, title, amount, category, date_str, notes)
    
    # Check for budget alerts immediately after adding
    alert = None
    try:
        # Convert date string back to object to check month
        date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d")
        budget_status = get_budget_status(request.user_id, date_obj)
        if budget_status and budget_status["exceeded"]:
            alert = {
                "message": f"Wait! You exceeded your budget for {budget_status['month']}!",
                "limit": budget_status["limit"],
                "total": budget_status["total_spent"]
            }
    except Exception as e:
        print(f"Budget check error: {e}")

    response = jsonify(result)
    if alert:
        # We can't easily append to the serialized result if it's a Response object, 
        # so let's reconstruct. result is a dict (from serialize_doc).
        result["alert"] = alert
        return jsonify(result), 201
        
    return jsonify(result), 201

# ---------------------------------------------------------------------------
# 2. GET Dashboard Stats
# ---------------------------------------------------------------------------
@routes.route("/api/stats", methods=["GET"])
@token_required
def get_stats():
    stats = get_dashboard_stats(request.user_id)
    return jsonify(stats), 200

# ---------------------------------------------------------------------------
# 3. POST / GET Budgets
# ---------------------------------------------------------------------------
@routes.route("/api/budgets", methods=["POST"])
@token_required
def set_budget():
    data = request.json
    month = data.get("month") # "2023-12"
    amount = data.get("limit")
    
    if not (month and amount):
        return jsonify({"error": "Missing month or limit"}), 400
        
    result = set_monthly_budget(request.user_id, month, amount)
    return jsonify(result), 200

# ---------------------------------------------------------------------------
# 4. GET Expenses: List Transactions
# ---------------------------------------------------------------------------
@routes.route("/api/expenses", methods=["GET"])
@token_required
def list_expenses():
    expenses = get_new_expenses(request.user_id)
    return jsonify(expenses), 200

# ---------------------------------------------------------------------------
# 3. GET Expense by ID
# ---------------------------------------------------------------------------
@routes.route("/api/expenses/<id>", methods=["GET"])
@token_required
def get_single_expense(id):
    expense = get_expense(request.user_id, id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    return jsonify(expense), 200

# ---------------------------------------------------------------------------
# 4. PUT Expense: Edit Transaction
# ---------------------------------------------------------------------------
@routes.route("/api/expenses/<id>", methods=["PUT"])
@token_required
def update_existing_expense(id):
    data = request.json
    result = update_expense(request.user_id, id, data)
    if not result:
        return jsonify({"error": "Expense not found or update failed"}), 404
    return jsonify(result), 200

# ---------------------------------------------------------------------------
# 5. DELETE Expense
# ---------------------------------------------------------------------------
@routes.route("/api/expenses/<id>", methods=["DELETE"])
@token_required
def delete_existing_expense(id):
    success = delete_expense(request.user_id, id)
    if not success:
        return jsonify({"error": "Expense not found"}), 404
    return jsonify({"message": "Expense deleted"}), 200

# ---------------------------------------------------------------------------
# 6. POST Preferences: Set Amount and Date
# ---------------------------------------------------------------------------
@routes.route("/api/preferences", methods=["POST"])
@token_required
def set_preferences():
    data = request.json
    # Expects e.g. {"goal_amount": 1000, "target_date": "2023-12-31"}
    result = upsert_preferences(request.user_id, data)
    return jsonify(result), 200

# ---------------------------------------------------------------------------
# 7. GET Preferences
# ---------------------------------------------------------------------------
@routes.route("/api/preferences", methods=["GET"])
@token_required
def get_user_preferences():
    prefs = get_preferences(request.user_id)
    if not prefs:
        return jsonify({}), 200
    return jsonify(prefs), 200

# ---------------------------------------------------------------------------
# 8. GET AI: Generate AI Report
# ---------------------------------------------------------------------------
@routes.route("/api/ai", methods=["GET"])
@token_required
def generate_ai_report():
    expenses = get_new_expenses(request.user_id)
    prefs = get_preferences(request.user_id)
    
    response_data, status_code = generate_financial_report(expenses, prefs)
    return jsonify(response_data), status_code
