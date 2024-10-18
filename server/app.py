from functools import wraps
import logging
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Resource, Api
from jwt import DecodeError
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Admin, Technician, Service, ClientRequest, Blog, PaymentService, Client
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from marshmallow import Schema, fields  # type: ignore

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "allow_headers": ["Authorization", "Content-Type"]}})

# Configure application
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///home_repair_service.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# Create uploads directory if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Role-based access control decorator
def role_required(*required_roles):
    """Decorator to check user role."""
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user = get_jwt_identity()
            user = Client.query.get(current_user['id'])
            if user is None or user.role not in required_roles:
                return jsonify(msg='Access forbidden: insufficient permissions'), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Marshmallow Schemas
class AdminSchema(Schema):
    id = fields.Int()
    username = fields.Str()
    email = fields.Str()
    phone = fields.Str()
    role = fields.Str()

class ServiceSchema(Schema):
    id = fields.Int()
    service_type = fields.Str()
    description = fields.Str()
    image_path = fields.Str()
    created_at = fields.DateTime()
    admin_id = fields.Int()

# API Resources
class Index(Resource):
    def get(self):
        app.logger.info('Hello endpoint was reached')
        return {"message": "Welcome to our Home Repair Service"}

class AdminResource(Resource):
    @role_required('admin')
    def get(self):
        admin = Admin.query.first()
        if not admin:
            return {'error': 'Admin not found'}, 404
        
        admin_schema = AdminSchema()
        admin_data = admin_schema.dump(admin)
        logging.info(f"Response data: {admin_data}")
        return {'admin': admin_data}, 200

    @role_required('admin')
    def delete(self, admin_id):
        admin = Admin.query.get(admin_id)
        if not admin:
            return {'error': 'Admin not found'}, 404
        db.session.delete(admin)
        db.session.commit()
        return {'message': 'Admin deleted successfully!'}, 200

class TechnicianResource(Resource):
    @role_required('admin')
    def get(self, technician_id=None):
        if technician_id:
            technician = Technician.query.get_or_404(technician_id)
            return technician.to_dict(), 200
        else:
            technicians = Technician.query.all()
            return {'technicians': [tech.to_dict() for tech in technicians]}, 200

    @role_required('admin')
    def post(self):
        data = request.json
        logging.info(f"Received technician data: {data}")

        required_fields = ['username', 'password', 'email', 'phone', 'image_path', 'occupation']
        for field in required_fields:
            if field not in data:
                return {'error': f'Missing {field}'}, 400
        
        new_technician = Technician(
            username=data['username'],
            password=generate_password_hash(data['password']),
            email=data['email'],
            phone=data['phone'],
            image_path=data['image_path'],
            occupation=data['occupation']
        )

        db.session.add(new_technician)
        db.session.commit()
        return {'message': 'Technician created successfully!', 'technician_id': new_technician.id}, 201

    @role_required('admin')
    def delete(self, technician_id):
        technician = Technician.query.get(technician_id)
        if not technician:
            return {'error': 'Technician not found'}, 404
        db.session.delete(technician)
        db.session.commit()
        return {'message': 'Technician deleted successfully!'}, 200

class UserResource(Resource):
    @role_required('admin')
    def post(self):
        data = request.json
        logging.info(f"Received user data: {data}")

        required_fields = ['username', 'email', 'phone', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return {'error': f'Missing {field}'}, 400

        hashed_password = generate_password_hash(data['password'])
        
        new_user = Client(
            username=data['username'],
            email=data['email'],
            phone=data['phone'],
            password=hashed_password,
            role=data['role']
        )
        
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User created successfully!', 'user_id': new_user.id}, 201
    
    @role_required('admin')
    def delete(self, user_id):
        user = Client.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User deleted successfully!'}, 200

class CustomerResource(Resource):
    @role_required('customer', 'admin', 'technician')
    def get(self, customer_id=None):
        if customer_id:
            customer = Client.query.get_or_404(customer_id)
            return customer.to_dict(), 200
        else:
            customers = Client.query.filter_by(role='customer').all()
            return {'customers': [customer.to_dict() for customer in customers]}, 200

    @role_required('customer')
    def put(self, customer_id):
        customer = Client.query.get_or_404(customer_id)
        if customer.id != get_jwt_identity()['id']:
            return {'error': 'You can only update your own account.'}, 403

        data = request.json
        customer.username = data.get('username', customer.username)
        customer.email = data.get('email', customer.email)
        customer.phone = data.get('phone', customer.phone)

        if 'password' in data:
            customer.password = generate_password_hash(data['password'])

        db.session.commit()
        return {'message': 'Customer updated successfully!', 'customer_id': customer.id}, 200

class LoginResource(Resource):
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')

        user = Client.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            access_token = create_access_token(identity={'id': user.id, 'is_admin': user.is_admin})
            app.logger.info(f"Generated access token for user: {user.id}.")
            return {'access_token': access_token}, 200

        app.logger.warning(f"Invalid credentials for user: {email}")
        return {'error': 'Invalid credentials'}, 401

class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return {'message': f'Welcome user {current_user["id"]}'}, 200

class SignupResource(Resource):
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')
        username = data.get('username')
        phone = data.get('phone')
        role = data.get('role')

        if Client.query.filter_by(email=email).first():
            return {'error': 'Email already exists.'}, 400

        hashed_password = generate_password_hash(password)

        new_user = Client(
            username=username,
            email=email,
            password=hashed_password,
            phone=phone,
            role=role
        )
        
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User created successfully!'}, 201

class ServiceResource(Resource):
    @role_required('admin', 'technician')
    def get(self, service_id=None):
        if service_id is not None:
            service = Service.query.get_or_404(service_id)
            service_schema = ServiceSchema()
            response = service_schema.dump(service)
            logging.info(f"Returning single service: {response}")
            return response, 200
        else:
            services = Service.query.all()
            services_schema = ServiceSchema(many=True)
            services_data = services_schema.dump(services)
            logging.info(f"Returning all services: {services_data}")
            return {'services': services_data}, 200

    @role_required('admin')
    def post(self):
        if 'file' not in request.files:
            return {'error': 'No file part'}, 400
        
        file = request.files['file']
        if file.filename == '':
            return {'error': 'No selected file'}, 400
        
        service_type = request.form.get('service_type')
        description = request.form.get('description')
        id_admin = request.form.get('id_admin')
        
        if not service_type or not description:
            return {'error': 'service_type and description are required'}, 400
        
        if id_admin is None:
            return {'error': 'Admin ID is required'}, 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        new_service = Service(
            service_type=service_type,
            description=description,
            image_path=file_path,
            id_admin=id_admin
        )

        try:
            db.session.add(new_service)
            db.session.commit()
            service_schema = ServiceSchema()
            return {'message': 'Service created successfully!', 'service': service_schema.dump(new_service)}, 201
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating service: {e}")
            return {'error': 'Failed to create service'}, 500

class RequestResource(Resource):
    @role_required('customer', 'technician', 'admin')
    def get(self, request_id=None):
        if request_id:
            request = ClientRequest.query.get_or_404(request_id)
            return request.to_dict(), 200
        else:
            requests = ClientRequest.query.all()
            return {'requests': [req.to_dict() for req in requests]}, 200

    @role_required('customer')
    def post(self):
        data = request.json
        logging.info(f"Received request data: {data}")

        required_fields = ['user_id', 'service_id', 'description']
        for field in required_fields:
            if field not in data:
                return {'error': f'Missing {field}'}, 400

        new_request = ClientRequest(
            user_id=data['user_id'],
            service_id=data['service_id'],
            description=data['description']
        )

        db.session.add(new_request)
        db.session.commit()
        return {'message': 'Service request created successfully!', 'request_id': new_request.id}, 201

class PaymentResource(Resource):
    @role_required('admin')
    def get(self, request_id=None):
        if request_id is not None:
            request = ClientRequest.query.get_or_404(request_id)
            payment_data = request.to_dict()
            logging.info(f"Payment data: {payment_data}")
            return payment_data, 200
        else:
            requests = ClientRequest.query.all()
            return {'requests': [req.to_dict() for req in requests]}, 200
    
    @role_required('admin')
    def post(self):
        data = request.json
        logging.info(f"Received payment data: {data}")

        required_fields = ['service_id', 'payment_method', 'amount']
        for field in required_fields:
            if field not in data:
                return {'error': f'Missing {field}'}, 400

        new_payment = PaymentService(
            service_id=data['service_id'],
            payment_method=data['payment_method'],
            amount=data['amount'],
            id_admin=data.get('id_admin')
        )

        db.session.add(new_payment)
        db.session.commit()
        return {'message': 'Payment created successfully!', 'payment_id': new_payment.id}, 201

class BlogResource(Resource):
    def get(self, blog_id=None):
        if blog_id:
            blog = Blog.query.get(blog_id)
            if not blog:
                return {'error': 'Blog not found'}, 404
            return blog.to_dict(), 200

        blogs = Blog.query.all()
        return {'blogs': [blog.to_dict() for blog in blogs]}, 200

# Add resources to API
api = Api(app)
api.add_resource(Index, '/')
api.add_resource(AdminResource, '/admin', '/admins/<int:admin_id>')
api.add_resource(TechnicianResource, '/technician')
api.add_resource(ServiceResource, '/services', '/services/<int:service_id>')
api.add_resource(RequestResource, '/requests', '/requests/<int:request_id>')
api.add_resource(PaymentResource, '/payment')
api.add_resource(BlogResource, '/blogs', '/blogs/<int:blog_id>')
api.add_resource(UserResource, '/users', '/users/<int:user_id>')
api.add_resource(LoginResource, '/login')
api.add_resource(SignupResource, '/signup')
api.add_resource(ProtectedResource, '/protected_route')
api.add_resource(CustomerResource, '/customers', '/customers/<int:customer_id>')

# Error handling
@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad Request'}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not Found'}), 404

@app.errorhandler(500)
def internal_error(error):
    logging.error(f"Internal error: {error}")
    return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
