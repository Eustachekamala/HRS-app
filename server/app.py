import logging
import os
from flask import Flask, request, send_from_directory, jsonify  # type: ignore
from flask_sqlalchemy import SQLAlchemy  # type: ignore
from flask_migrate import Migrate  # type: ignore
from flask_cors import CORS  # type: ignore
from models import db, Admin, Technician, Service, UserRequest, Blog, PaymentService, User
from flask_restful import Resource, Api  # type: ignore

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///home_repair_service.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads/'  
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

db.init_app(app)
migrate = Migrate(app, db)

class Index(Resource):
    def get(self):
        return {
            "message": "Welcome to our Home Repair Service"
        }
    
api.add_resource(Index, "/")

#! GET admin
@app.route('/admin', methods=['GET'])
def get_admin():
    admin = Admin.query.first()
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404
    return jsonify({
        'admin': admin.to_dict()
    }), 200
    
#! GET technician
@app.route('/technician', methods=['GET'])
def get_technician():
    technician = Technician.query.first()
    if not technician:
        return jsonify({'error': 'Technician not found'}), 404
    return jsonify({
        'technician': technician.to_dict()
    }), 200
    
#! POST Technician
@app.route('/technician', methods=['POST'])
def post_technician():
    data = request.json
    logging.info(f"Received technician data: {data}")
    
    # Validate incoming data
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    if 'username' not in data:
        return jsonify({'error': 'Missing username'}), 400
    
    if 'password' not in data:
        return jsonify({'error': 'Missing password'}), 400
    
    if 'email' not in data:
        return jsonify({'error': 'Missing email'}), 400
    
    if 'phone' not in data:
        return jsonify({'error': 'Missing phone'}), 400
    
    if 'image_path' not in data:
        return jsonify({'error': 'Missing image_path'}), 400
    
    if 'occupation' not in data:
        return jsonify({'error': 'Missing occupation'}), 400
    
    # Create a new Technician
    new_technician = Technician(
        username=data['username'],
        password=data['password'],
        email=data['email'],
        phone=data['phone'],
        image_path=data['image_path'],
        occupation=data['occupation']
    )
    
    db.session.add(new_technician)
    db.session.commit()
    
#! Delete a specific technician by ID
@app.route('/technician/<int:technician_id>', methods=['DELETE'])
def delete_technician(technician_id):
    technician = Technician.query.get(technician_id)
    
    if not technician:
        return jsonify({'error': 'Technician not found'}), 404
    
    db.session.delete(technician)
    db.session.commit()
    
    return jsonify({'message': 'Technician deleted successfully!'}), 200

#! Delete a specific admin by ID
@app.route('/admins/<int:admin_id>', methods=['DELETE'])
def delete_admin(admin_id):
    admin = Admin.query.get(admin_id)
    
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404
    
    db.session.delete(admin)
    db.session.commit()
    
    return jsonify({'message': 'Admin deleted successfully!'}), 200



#! Upload an image for a service request
@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    service_type = request.form.get('service_type', '')
    description = request.form.get('description', '')

    # Save the file to the uploads folder
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # Create a new Service with no request_id initially
    new_service = Service(
        service_type=service_type,
        description=description,
        image_path=file_path
    )
    db.session.add(new_service)
    db.session.commit()

    return jsonify({
        'message': 'Image uploaded and service created!',
        'imagePath': file.filename,
        'service_id': new_service.id
    }), 201

#! Serve uploaded files
@app.route('/uploads/<path:filename>', methods=['GET'])
def upload_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

#! Get all services
@app.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify({
        'services': [service.to_dict() for service in services]
    })

#! Get a specific service by ID
@app.route('/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    service = Service.query.get(service_id)
    
    if not service:
        return jsonify({'error': 'Service not found'}), 404

    return jsonify({
        'service': service.to_dict()
    }), 200

#! Get all blogs
@app.route('/blogs', methods=['GET'])
def get_blogs():
    blogs = Blog.query.all()
    return jsonify({
        'blogs': [blog.to_dict() for blog in blogs]  # Use to_dict() for serialization
    })

#! Manage service requests
@app.route('/services/request', methods=['POST'])
def manage_service_request():
    data = request.json
    logging.info(f"Received request data: {data}")
    
    # Validate incoming data
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    if 'service_id' not in data:
        return jsonify({'error': 'Missing service_id'}), 400
    
    if 'description' not in data:
        return jsonify({'error': 'Missing request description'}), 400
    
    # Create a new UserRequest
    new_request = UserRequest(
        user_id=data.get('user_id'),  # Ensure this is provided in the request
        service_id=data['service_id'],
        description=data['description']
    )
    
    db.session.add(new_request)
    db.session.commit()

    return jsonify({'message': 'Service request created successfully!', 'request_id': new_request.id}), 201

#! Get all the requests made by users
@app.route('/requests', methods=['GET'])
def get_requests():
    requests = UserRequest.query.all()
    return jsonify({
        'requests': [req.to_dict() for req in requests]  # Use to_dict() for serialization
    })

#! Get a specific request by ID
@app.route('/requests/<int:request_id>', methods=['GET'])
def get_request(request_id):
    req = UserRequest.query.get(request_id)
    
    if not req:
        return jsonify({'error': 'Request not found'}), 404

    return jsonify({
        'request': req.to_dict()  # Use to_dict() for serialization
    }), 200
    
    
#! Payment for a service request
@app.route('/payment', methods=['POST'])
def payment():
    data = request.json
    logging.info(f"Received payment data: {data}")
    
    # Validate incoming data
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    if 'service_id' not in data:
        return jsonify({'error': 'Missing service_id'}), 400
    
    if 'payment_method' not in data:
        return jsonify({'error': 'Missing payment_method'}), 400
    
    if 'amount' not in data:
        return jsonify({'error': 'Missing amount'}), 400
    
    # Create a new PaymentService
    new_payment = PaymentService(
        service_id=data['service_id'],
        payment_method=data['payment_method'],
        amount=data['amount']
    )
    
    db.session.add(new_payment)
    db.session.commit()
    
    return jsonify({'message': 'Payment created successfully!', 'payment_id': new_payment.id}), 201


#! Delete a specific request by ID
@app.route('/requests/<int:request_id>', methods=['DELETE'])
def delete_request(request_id):
    req = UserRequest.query.get(request_id)
    
    if not req:
        return jsonify({'error': 'Request not found'}), 404

    db.session.delete(req)
    db.session.commit()

    return jsonify({'message': 'Request deleted successfully!'}), 200

if __name__ == '__main__':
    app.run(debug=True)
