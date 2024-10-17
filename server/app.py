import logging
import os
from flask import Flask, request, jsonify, g, send_from_directory  # type: ignore
from flask_sqlalchemy import SQLAlchemy  # type: ignore
from flask_migrate import Migrate  # type: ignore
from flask_cors import CORS  # type: ignore
from flask_restful import Resource, Api  # type: ignore
from werkzeug.utils import secure_filename  # type: ignore
from models import db, Admin, Technician, Service, UserRequest, Blog, PaymentService

# Setup logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

# Configure application
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///home_repair_service.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Create uploads directory if it doesn't exist
# if not os.path.exists(app.config['UPLOAD_FOLDER']):
#     os.makedirs(app.config['UPLOAD_FOLDER'])

db.init_app(app)
migrate = Migrate(app, db)

# Helper function to check if the user is an admin
def is_admin():
    return getattr(g, 'user', None) is not None and g.user.is_admin

# Index Resource
class Index(Resource):
    def get(self):
        app.logger.info('Hello endpoint was reached')
        return {"message": "Welcome to our Home Repair Service"}

# Admin Resource
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

# Technician Resource
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

# Service Resource
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

        if not service_type or not description:
            return {'error': 'service_type and description are required'}, 400

        # Secure the filename
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        new_service = Service(
            service_type=service_type,
            description=description,
            image_path=file_path
        )

        try:
            db.session.add(new_service)
            db.session.commit()
            return {'message': 'Service created successfully!', 'service_id': new_service.id}, 201
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error creating service: {e}")
            return {'error': 'Failed to create service'}, 500

# Upload Image Resource
# class UploadImage(Resource):
#     def post(self):
#         if 'file' not in request.files:
#             return {'error': 'No file part'}, 400
        
#         file = request.files['file']
#         if file.filename == '':
#             return {'error': 'No selected file'}, 400
        
#         service_type = request.form.get('service_type','')
#         description = request.form.get('description','')

#         # Secure the filename
#         # filename = secure_filename(file.filename)
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
#         file.save(file_path)

#         new_service = Service(service_type=service_type, description=description, image_path=file_path)
#         db.session.add(new_service)
#         db.session.commit()

#         return {'message': 'Image uploaded and service created!', 'imagePath': file.filename, 'service_id': new_service.id}, 201

# # Upload Resource
# class UploadResource(Resource):
#     def get(self, filename=None):
#         if filename is None:
#             return {'error': 'No filename provided'}, 400
#         return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Request Resource
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

# Payment Resource
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

# Blog Resource
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
# api.add_resource(UploadImage, '/upload')
# api.add_resource(UploadResource, '/uploads/<path:filename>')
api.add_resource(RequestResource, '/requests', '/requests/<int:request_id>')
api.add_resource(PaymentResource, '/payment')
api.add_resource(BlogResource, '/blogs', '/blogs/<int:blog_id>')

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
