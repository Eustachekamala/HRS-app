from datetime import datetime, timedelta
from functools import wraps
import logging 
import os
from flask import Flask, request, jsonify, redirect, url_for, send_from_directory 
from flask_sqlalchemy import SQLAlchemy 
from flask_migrate import Migrate 
from flask_cors import CORS 
from flask_restful import Resource, Api 
from jwt import DecodeError, ExpiredSignatureError
from werkzeug.utils import secure_filename 
from werkzeug.security import generate_password_hash, check_password_hash 
from models import db, Admin, Technician, Service, ClientRequest, Blog, PaymentService, Users , User
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, get_jwt, jwt_required, get_jwt_identity 
from dotenv import load_dotenv
from marshmallow import Schema, fields  



app = Flask(__name__)
CORS(app)

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": {"https://hrs-app.onrender.com","https://localhost:3000"}, "allow_headers": ["Authorization", "Content-Type"]}})

# Configure application
app.config['SQLALCHEMY_DATABASE_URI'] = (
    'postgresql://hrsdb_render:wxXeemVxqyW9E0M2ShysVXTiFRtuGGku@'
    'dpg-csbr86hu0jms73fh6b10-a.oregon-postgres.render.com:5432/home_repair_service_db?sslmode=require'
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['JWT_SECRET_KEY'] = 'd0125980dce744babe622a0f6e40caf6'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

#! Create uploads directory if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])



db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

blacklist = set()


@jwt.token_in_blocklist_loader
def check_if_token_is_blacklisted(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in blacklist


# !Error handler for expired tokens
@app.errorhandler(ExpiredSignatureError)
def handle_expired_token(error):
    logging.warning("Attempted access with expired token.")
    return jsonify({'error': 'Token has expired. Please log in again.'}), 401

#! Role-based access control decorator
def role_required(*required_roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user = get_jwt_identity()
            user = Users.query.get(current_user['id'])
            if user is None or user.role not in required_roles:
                return jsonify(msg='Access forbidden: insufficient permissions'), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

#! Marshmallow Schemas
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

#! API Resources
class Upload(Resource):
    def get(self, filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
#! AdminaddService to add service to admin
class AdminaddService(Resource):
    @jwt_required()
    def post(self):
        data = request.json
        logging.info(f"Received service data: {data}")
        
        required_fields = ['service_type', 'description', 'image_path']
        for field in required_fields:
            if field not in data:
                return {'error': f'Missing {field}'}, 400
        
        new_service = Service(
            service_type=data['service_type'],
            description=data['description'],
            image_path=data['image_path'],
            admin_id=get_jwt_identity()['id']
        )
        
        db.session.add(new_service)
        db.session.commit()
        return {'message': 'Service created successfully!', 'service_id': new_service.to_dict()}, 201
     
class Index(Resource):
    def get(self):
        app.logger.info('Hello endpoint was reached')
        return {"message": "Welcome to our Home Repair Service"}

#! AdminResource to get admin details
class AdminResource(Resource):
    @role_required('admin')
    def get(self):
        user = Admin.query.filter_by(role='admin').first()
        if not user:
            return {'error': 'Admin not found'}, 404
        
        admin_schema = AdminSchema()
        admin_data = admin_schema.dump(user)
        logging.info(f"Response data: {admin_data}")
        return {'admin': admin_data}, 200

    @role_required('admin')
    def delete(self, admin_id):
        admin = User.query.get(admin_id)
        if not admin:
            return {'error': 'Admin not found'}, 404
        db.session.delete(admin)
        db.session.commit()
        return {'message': 'Admin deleted successfully!'}, 200

    
#! TechnicianResource to get technician details
class TechnicianResource(Resource):
    # @role_required('admin', 'technician')
    def get(self):
        try:
            technicians = Technician.query.all()
            if not technicians:
                return jsonify({"message": "No technicians found."}), 404
            
            technicians_data = [tech.to_dict() for tech in technicians]
            return {'technicians': technicians_data}, 200
            
        except Exception as e:
            logging.error(f"Error retrieving technicians: {e}")
            return {'error': 'Failed to retrieve technicians'}, 500
        
    #! Post method to add technician
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
    
    #! Delete method to delete technician
    @role_required('admin')
    def delete(self, technician_id):
        technician = Technician.query.get(technician_id)
        if not technician:
            return {'error': 'Technician not found'}, 404
        db.session.delete(technician)
        db.session.commit()
        return {'message': 'Technician deleted successfully!'}, 200

#! UserResource to manage users
class UserResource(Resource):
    @role_required('admin')
    def get(self):
        users = Users.query.filter_by(role='user').all()
        response_data = [user.to_dict() for user in users]
        return {
            "message": "Users retrieved successfully!",
            "data": response_data
        }
        
    #! Post method to add user
    @role_required('admin')
    def post(self):
        data = request.json
        logging.info(f"Received user data: {data}")

        required_fields = ['username', 'email', 'phone', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return {'error': f'Missing {field}'}, 400

        hashed_password = generate_password_hash(data['password'])
        
        new_user = Users(
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
    def delete(self, customer_id):
        user = User.query.get(customer_id)
        if not user:
            return {'error': 'User not found'}, 404
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User deleted successfully!'}, 200

#! To manage the customer
class CustomerResource(Resource):
    @role_required('customer', 'admin')
    def get(self, customer_id=None):
        if customer_id:
            customer = Users.query.get_or_404(customer_id)
            return customer.to_dict(), 200
        else:
            customers = Users.query.filter_by(role='customer').all()
            return {'customers': [customer.to_dict() for customer in customers]}, 200
        
    #! Put method to update customer
    @role_required('customer')
    def put(self, customer_id):
        customer = Users.query.get_or_404(customer_id)
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

#! LoginResource to login
class LoginResource(Resource):
    def post(self):
        try:
            data = request.json
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return {'error': 'Email and password are required.'}, 400

            # Try to find user in any of the user tables
            user = (Admin.query.filter_by(email=email).first() or
                   Technician.query.filter_by(email=email).first() or
                   Users.query.filter_by(email=email).first())

            if not user:
                return {'error': 'User not found.'}, 404

            logging.info(f'Login attempt - User ID: {user.id}, Role: {user.role}')

            if check_password_hash(user.password, password):
                # Create token identity with consistent structure
                token_identity = {
                    'id': user.id,
                    'role': user.role,
                    'email': user.email
                }

                # Create tokens with consistent claims
                access_token = create_access_token(
                    identity=token_identity,
                    expires_delta=timedelta(days=1),
                    additional_claims={'role': user.role}
                )
                
                refresh_token = create_refresh_token(
                    identity=token_identity,
                    additional_claims={'role': user.role}
                )

                logging.info(f'Generated access token: {access_token}')
                logging.info(f'Generated refresh token: {refresh_token}')

                # Determine redirect URL based on role
                if user.role == 'admin':
                    redirect_url = url_for('admin_resource') if 'admin_resource' in app.view_functions else None
                elif user.role == 'technician':
                    redirect_url = url_for('technician_resource') if 'technician_resource' in app.view_functions else None
                elif user.role == 'user':
                    redirect_url = url_for('services_resource') if 'services_resource' in app.view_functions else None
                else:
                    redirect_url = url_for('login_resource') if 'login_resource' in app.view_functions else None

                # Convert user object to dictionary with consistent structure
                # user_dict = {
                #     'id': user.id,
                #     'email': user.email,
                #     'role': user.role,
                #     'username': getattr(user, 'username', None),
                #     'phone': getattr(user, 'phone', None)
                # }
                
                return {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'customers': [user.to_dict()],
                "redirect": redirect_url
                }, 200

                # return {
                #     'access_token': access_token,
                #     'refresh_token': refresh_token,
                #     'customers': [user_dict],
                #     'redirect': redirect_url
                # }, 200

            return {'error': 'Invalid credentials'}, 401

        except Exception as e:
            logging.error(f'Login error: {str(e)}')
            return {'error': 'An error occurred during login.'}, 500
        
#! ProtectedResource to check if user is authorized
class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        # Get the claims from the JWT
        claims = get_jwt()
        user_role = claims['sub']['role']  # Access role from the 'sub' claim
        current_user = get_jwt_identity()

        # Check expiration and not before claims
        current_time = datetime.utcnow().timestamp()
        exp = claims['exp']
        nbf = claims.get('nbf')

        if current_time > exp:
            return jsonify(error="Token has expired."), 401
        if nbf and current_time < nbf:
            return jsonify(error="Token is not yet valid."), 403

        # Welcome message based on the user's role
        if user_role == 'admin':
            return jsonify(message=f"Welcome, Admin {current_user['id']}!"), 200
        elif user_role == 'technician':
            return jsonify(message=f"Welcome, Technician {current_user['id']}!"), 200
        elif user_role == 'client':
            return jsonify(message=f"Welcome, Users {current_user['id']}!"), 200
        else:
            return jsonify(message="Role not recognized."), 403
        

#! RefreshTokenResource to refresh token
class RefreshTokenResource(Resource):
    @jwt_required(refresh=True)
    def post(self):
        # Get the identity of the current user
        current_user = get_jwt_identity()

        # Create a new access token with a 1-day expiration
        new_access_token = create_access_token(identity=current_user, expires_delta=timedelta(days=1))

        # Return the new access token as a JSON response
        return jsonify({'access_token': new_access_token}), 200
    
#! SignupResource to signup
class SignupResource(Resource):
    def post(self):
        try:
            data = request.json
            email = data.get('email')
            password = data.get('password')
            username = data.get('username')
            phone = data.get('phone')
            role = data.get('role')

            # Validate required fields
            if not all([email, password, username, role]):
                return {'error': 'Missing required fields.'}, 400

            # Check if email exists
            if Users.query.filter_by(email=email).first():
                return {'error': 'Email already exists.'}, 400

            # Validate admin signup
            # if role == 'admin':
            #     if not admin_code or admin_code != 'your_admin_code':
            #         return {'error': 'Invalid admin code.'}, 400

            # Create new user
            hashed_password = generate_password_hash(password)
            
            new_user = Users(
                username=username,
                email=email,
                password=hashed_password,
                phone=phone,
                role=role
            )

            # Save to database
            db.session.add(new_user)
            db.session.commit()

            # Create token identity with consistent structure
            token_identity = {
                'id': new_user.id,
                'role': new_user.role,
                'email': new_user.email
            }

            # Generate tokens with consistent claims
            access_token = create_access_token(
                identity=token_identity,
                expires_delta=timedelta(days=1),
                additional_claims={'role': new_user.role}
            )
            
            refresh_token = create_refresh_token(
                identity=token_identity,
                additional_claims={'role': new_user.role}
            )

            # Convert user object to dictionary
            # user_dict = {
            #     'id': new_user.id,
            #     'email': new_user.email,
            #     'role': new_user.role,
            #     'username': new_user.username,
            #     'phone': new_user.phone
            # }
            
           # Determine redirect URL to login
            redirect_url = url_for('login_resource') if 'login_resource' in app.view_functions else None
            
             # Log the successful account creation
            logging.info(f'User created successfully - User ID: {new_user.id}')
            
            return {
                'message': 'User created successfully!',
                'access_token': access_token,
                'refresh_token': refresh_token,
                'customers': [new_user.to_dict()],
                'redirect': redirect_url
            }, 200

            # return {
            #     'message': 'User created successfully!',
            #     'access_token': access_token,
            #     'refresh_token': refresh_token,
            #     'customers': [user_dict]
            # }, 201

        except Exception as e:
            db.session.rollback()
            logging.error(f'Signup error: {str(e)}')
            return {'error': 'An error occurred during signup.'}, 500

#! LogoutResource to logout
class LogoutResource(Resource):
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]  # Get the token identifier (JTI)
        blacklist.add(jti)  # Add JTI to the blacklist
        return {"msg": "Successfully logged out"}, 200
    
#! ServiceResource to get service details
class ServiceResource(Resource):
    # @role_required('admin', 'technician')
    def get(self, service_id=None):
        if service_id is not None:
            service = Service.query.get_or_404(service_id)
            service_schema = ServiceSchema()
            response = service_schema.dump(service)
            return response, 200
        else:
            services = Service.query.all()
            services_schema = ServiceSchema(many=True)
            services_data = services_schema.dump(services)
            return {'services': services_data}, 200
        
#! Post method to add service
    @role_required('admin')
    def post(self):
        # JWT validation handled by the decorator
        current_user = get_jwt_identity()  # Optional: get user details if needed
        
        # Validate the presence of a file
        if 'file' not in request.files:
            return {'error': 'No file part'}, 400
        
        file = request.files['file']
        if file.filename == '':
            return {'error': 'No selected file'}, 400
        
        # Validate required form fields
        service_type = request.form.get('service_type')
        description = request.form.get('description')
        id_admin = request.form.get('id_admin')
        
        if not service_type or not description:
            return {'error': 'service_type and description are required'}, 400
        
        if id_admin is None:
            return {'error': 'Admin ID is required'}, 400

        # Secure the filename and save the file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        try:
            file.save(file_path)

            # Create and save the new service
            new_service = Service(
                service_type=service_type,
                description=description,
                image_path=file_path,
                id_admin=id_admin
            )

            db.session.add(new_service)
            db.session.commit()

            service_schema = ServiceSchema()
            return {'message': 'Service created successfully!', 'service': service_schema.dump(new_service)}, 201
        
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating service: {e}")
            return {'error': 'Failed to create service'}, 500
        


    @role_required('admin')
    def post(self):
        # JWT validation handled by the decorator
        current_user = get_jwt_identity()  # Optional: get user details if needed
        
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
        
#! RequestResource to get request details
class RequestResource(Resource):
    @role_required('user, technician', 'admin')
    def get(self, request_id=None):
        if request_id:
            request = ClientRequest.query.get_or_404(request_id)
            return request.to_dict(), 200
        else:
            requests = ClientRequest.query.all()
            return {'requests': [req.to_dict() for req in requests]}, 200
        
    #! To make a request
    @role_required('user')
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
    
#! PaymentResource to get payment details
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
    
#! BlogResource to get blog details
class BlogResource(Resource):
    # @jwt_required()
    def get(self):
        try:
            blogs = Blog.query.all()
            if not blogs:
                return jsonify({"message": "No blogs found."}), 404
            
            blogs_data = [blog.to_dict() for blog in blogs]
            return {'blogs': blogs_data}, 200
            
        except Exception as e:
            logging.error(f"Error retrieving blogs: {e}")
            return {'error': 'Failed to retrieve blogs'}, 500
        
#! To get all requests made for a technician
class TechnicianServiceRequests(Resource):
    @role_required('technician')
    def get(self, technician_id):
        try:
            requests = ClientRequest.query.filter_by(technician_id=technician_id).all()
            return [ request.to_dict() for request in requests], 200
        
        except Exception as e:
            logging.error(f"Error retrieving technician requests: {e}")
            return {'error': 'Failed to retrieve technician requests'}, 500
        
#! The statistic of the app..
class StatisticResource(Resource):
    def get(self):
        total_requests = ClientRequest.query.count()
        active_technicians = Technician.query.filter_by(role='technician').count()

        return {
            'total_requests': total_requests,
            'active_technicians': active_technicians
        }, 200 
    
# Add resources to API
api = Api(app)
api.add_resource(Index, '/')
api.add_resource(AdminResource, '/admin', '/admins/<int:admin_id>', endpoint='admin_resource')
api.add_resource(TechnicianResource, '/technicians', endpoint='technician_resource')
api.add_resource(ServiceResource, '/services', '/services/<int:service_id>',  endpoint='services_resource')
api.add_resource(RequestResource, '/requests', '/requests/<int:request_id>')
api.add_resource(PaymentResource, '/payment')
api.add_resource(BlogResource, '/blogs', '/blogs/<int:blog_id>')
api.add_resource(UserResource, '/users', '/users/<int:user_id>')
api.add_resource(LoginResource, '/login', endpoint='login_resource')
api.add_resource(SignupResource, '/signup',endpoint='signup_resource')
api.add_resource(ProtectedResource, '/protected_route')
api.add_resource(CustomerResource, '/customers', '/customers/<int:customer_id>')
api.add_resource(RefreshTokenResource, '/refresh_token')
api.add_resource(LogoutResource, '/logout')
api.add_resource(Upload, '/uploads/<path:filename>')
api.add_resource(TechnicianServiceRequests, '/technician/<int:technician_id>/requests')
api.add_resource(AdminaddService, '/admin/services')
api.add_resource(StatisticResource, '/statistic')

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
