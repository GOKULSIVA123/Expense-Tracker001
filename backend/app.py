import os
from flask import Flask,jsonify,request
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import CORS
mongo_client=None
db=None
def get_db():
    return db

def create_app():
    global mongo_client,db
    load_dotenv()
    app=Flask(__name__)
    app.config['SECRET_KEY']=os.getenv("SECRET_KEY")
    CORS(app)
    mongo_uri=os.getenv("MONGO_URI","mongodb://localhost:27017/")
    try:
        mongo_client=MongoClient(mongo_uri)
        db=mongo_client.expensetrackerdb04
        print("mongodb connection is succesful")
    except Exception as e:
        print("some issues",e)
    # from . import models
    # # from .routes import expenseapis
    # app.register_blueprint(expenseapis,url_prefix='/api/expenses')
    @app.route("/")
    def hello():
        return "Hello"
    @app.route("/api/health_check")
    def healthcheck():
        try:
            mongo_client.admin.command('ping')
            return jsonify({"status":"ok","dbconnected":True}),200
        except Exception as e:
            return jsonify({"status":'error',"dbconnected":False}),500
    return app

    