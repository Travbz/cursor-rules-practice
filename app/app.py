from flask import Flask, jsonify, request
from backend.models import db, Sale
from backend.animals import generate_random_purchase, ANIMALS
from datetime import datetime
import os

app = Flask(__name__)

# Configure the database path
db_dir = os.path.join(os.path.dirname(__file__), 'database')
db_path = os.path.join(db_dir, 'sales.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS for development
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST')
    return response

db.init_app(app)

@app.route('/api/animals', methods=['GET'])
def get_animals():
    # Return original prices as they are (in dollars)
    return jsonify(ANIMALS)

@app.route('/api/sales', methods=['GET'])
def get_sales():
    sales = Sale.query.all()
    return jsonify({'sales': [sale.to_dict() for sale in sales]})

@app.route('/api/sales', methods=['POST'])
def create_sale():
    data = request.get_json()
    sale = Sale(
        customer_name=data['customer_name'],
        animal=data['animal'],
        quantity=data['quantity'],
        price=data['price']
    )
    db.session.add(sale)
    db.session.commit()
    return jsonify(sale.to_dict())

@app.route('/api/generate', methods=['POST'])
def generate_sale():
    sale_data = generate_random_purchase()
    
    for purchase in sale_data['purchases']:
        sale = Sale(
            customer_name=sale_data['customer_name'],
            animal=purchase['animal'],
            quantity=purchase['quantity'],
            price=purchase['price']
        )
        db.session.add(sale)
    
    db.session.commit()
    return jsonify({'sale': sale_data})

@app.route('/api/sales/by-animal', methods=['GET'])
def sales_by_animal():
    sales = db.session.query(
        Sale.animal,
        db.func.count(Sale.id),
        db.func.sum(Sale.price)
    ).group_by(Sale.animal).all()
    
    return jsonify({
        'sales': [{
            'animal': animal,
            'count': count,
            'total': float(total)
        } for animal, count, total in sales]
    })

if __name__ == '__main__':
    with app.app_context():
        if not os.path.exists(db_dir):
            os.makedirs(db_dir)
        db.create_all()
    port = int(os.environ.get('FLASK_RUN_PORT', 5000))
    app.run(debug=True, port=port)
