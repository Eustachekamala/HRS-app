import logging
import os
from flask import Flask, request, jsonify, g, send_from_directory  # type: ignore
from flask_sqlalchemy import SQLAlchemy  # type: ignore
from flask_migrate import Migrate  # type: ignore
from flask_cors import CORS  # type: ignore
from flask_restful import Resource, Api  # type: ignore
import jwt
from werkzeug.utils import secure_filename  # type: ignore
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Admin, Technician, Service, UserRequest, Blog, PaymentService, User
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

jwt = JWTManager(app)
api = Api(app)

# Configure application
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///home_repair_service.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Create uploads directory if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db.init_app(app)
migrate = Migrate(app, db)

#! Helper function to check if the user is an admin
def is_admin():
    return getattr(g, 'user', None) is not None and g.user.is_admin

#! Index Resource
class Index(Resource):
    def get(self):
        app.logger.info('Hello endpoint was reached')
        return {"message": "Welcome to our Home Repair Service"}

#! Admin Resource
class AdminResource(Resource):
    def get(self):
        admin = Admin.query.first()
        if not admin:
            return {'error': 'Admin not found'}, 404
        return {'admin': admin.to_dict()}, 200

    def delete(self, admin_id):
        admin = Admin.query.get(admin_id)
        if not admin:
            return {'error': 'Admin not found'}, 404
        db.session.delete(admin)
        db.session.commit()
        return {'message': 'Admin deleted successfully!'}, 200

#! Technician Resource
class TechnicianResource(Resource):
    def get(self):
        technicians = Technician.query.all()
        return {'technicians': [tech.to_dict() for tech in technicians]}, 200

    def post(self):
        data = request.json
        logging.info(f"Received technician data: {data}")

        required_fields = ['username', 'password', 'email', 'phone', 'image_path', 'occupation']
        for field in required_fields:
            if field not in data:
                return {'error': f'Missing {field}'}, 400
        
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
        return {'message': 'Technician created successfully!', 'technician_id': new_technician.id}, 201

    def delete(self, technician_id):
        technician = Technician.query.get(technician_id)
        if not technician:
            return {'error': 'Technician not found'}, 404
        db.session.delete(technician)
        db.session.commit()
        return {'message': 'Technician deleted successfully!'}, 200
    
#! User Resource
class UserResource(Resource):
    def get(self, user_id=None):
        if user_id is not None:
            user = User.query.get_or_404(user_id)
            return user.to_dict(), 200
        else:
            users = User.query.all()
            return {'users': [user.to_dict() for user in users]}, 200
        
    def post(self):
        data = request.json
        logging.info(f"Received user data: {data}")
        
        required_fields = ['username', 'email', 'phone', 'password']
        for field in required_fields:
            if field not in data:
                return {'error': f'Missing {field}'}, 400
        
        new_user = User(
            username=data['username'],
            email=data['email'],
            phone=data['phone'],
            password=data['password']
        )
        
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User created successfully!', 'user_id': new_user.id}, 201
    
    def delete(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User deleted successfully!'}, 200
    
#! Login Resource
class LoginResource(Resource):
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):
            access_token = create_access_token(identity={'id': user.id, 'role': 'user'})
            return {'access_token': access_token}, 200

        return {'error': 'Invalid credentials'}, 401
    
#! Signup Resource
class SignupResource(Resource):
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')
        username = data.get('username')
        phone = data.get('phone')
        
        if User.query.filter_by(email=email).first():
            return {'error': 'Email already exists.'}, 400
        
        hashed_password = generate_password_hash(password)
        
        new_user = User(
            email=email,
            password=hashed_password,
            username=username,
            phone=phone,
            google_id=None,
            is_admin=False
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return {'message': 'User created successfully!'}, 201
    
    def delete(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User deleted successfully!'}, 200
          

#! Google Login Resource
class GoogleLoginResource(Resource):
    def post(self):
        data = request.json
        google_id = data.get('google_id')
        email = data.get('email')
        username = data.get('username')

        user = User.query.filter_by(google_id=google_id).first()

        if not user:
            # Create a new user if they don't exist
            new_user = User(
                google_id=google_id,
                email=email,
                username=username
            )
            db.session.add(new_user)
            db.session.commit()
            user = new_user

        access_token = create_access_token(identity={'id': user.id, 'role': 'user'})
        return {'access_token': access_token}, 200
        
#! Protected Resource
class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return {'message': f'Welcome user {current_user["id"]}'}, 200
    

#! Service Resource
class ServiceResource(Resource):
    def get(self, service_id=None):
        if service_id is not None:
            service = Service.query.get_or_404(service_id)
            return service.to_dict(), 200
        else:
            services = Service.query.all()
            return {'services': [service.to_dict() for service in services]}, 200

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

        # Secure the filename
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
            return {'message': 'Service created successfully!', 'service_id': new_service.id}, 201
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating service: {e}")
            return {'error': 'Failed to create service'}, 500


#! Request Resource
class RequestResource(Resource):
    def get(self):
        requests = UserRequest.query.all()
        return {'requests': [req.to_dict() for req in requests]}, 200

    def post(self):
        data = request.json
        logging.info(f"Received request data: {data}")

        required_fields = ['user_id', 'service_id', 'description']
        for field in required_fields:
            if field not in data:
                return {'error': f'Missing {field}'}, 400

        new_request = UserRequest(
            user_id=data['user_id'],
            service_id=data['service_id'],
            description=data['description']
        )

        db.session.add(new_request)
        db.session.commit()
        return {'message': 'Service request created successfully!', 'request_id': new_request.id}, 201

#! Payment Resource
class PaymentResource(Resource):
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

#! Blog Resource
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
api.add_resource(GoogleLoginResource, '/auth/google')

# Error handling
@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad Request'}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not Found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
