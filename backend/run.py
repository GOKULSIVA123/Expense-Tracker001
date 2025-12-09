from app import create_app
from models import insert_gokul_data
app=create_app()
if __name__=='__main__':
    with app.app_context():
        insert_gokul_data()
    app.run(debug=True)
