from flask_sqlalchemy import SQLAlchemy  # type: ignore
from sqlalchemy import func  # type: ignore
from sqlalchemy_serializer import SerializerMixin  # type: ignore
from datetime import datetime

db = SQLAlchemy()

class BaseModel(db.Model):
    """Base model with serialization capabilities."""
    __abstract__ = True

    def to_dict(self):
        """Convert model instance to dictionary."""
        return {
            column.name: (getattr(self, column.name).isoformat() if isinstance(getattr(self, column.name), datetime) else getattr(self, column.name))
            for column in self.__table__.columns
        }

class Admin(BaseModel, SerializerMixin):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(120), nullable=False)
    image_path = db.Column(db.String(120), nullable=True)
    is_admin = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, server_default=func.now())

    technicians = db.relationship('Technician', back_populates='admin')
    services = db.relationship('Service', back_populates='admin')

class Technician(BaseModel, SerializerMixin):
    __tablename__ = 'technicians'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(120), nullable=True)
    image_path = db.Column(db.String(120), nullable=True)
    occupation = db.Column(db.String(120), nullable=False)
    id_admin = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    created_at = db.Column(db.DateTime, server_default=func.now())

    admin = db.relationship('Admin', back_populates='technicians')

class Service(BaseModel, SerializerMixin):
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    service_type = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_path = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    
    user_requests = db.relationship('UserRequest', back_populates='service')
    id_admin = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    admin = db.relationship('Admin', back_populates='services')

class User(BaseModel, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    password = db.Column(db.String(128), nullable=False)
    google_id = db.Column(db.String(128), nullable=True)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    
    user_requests = db.relationship('UserRequest', back_populates='user')
    

class UserRequest(BaseModel, SerializerMixin):
    __tablename__ = 'user_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=func.now())
    
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    admin = db.relationship('Admin')
    
    payment_services = db.relationship('PaymentService', back_populates='user_request')
    user = db.relationship('User', back_populates='user_requests')
    service = db.relationship('Service', back_populates='user_requests')

class Blog(BaseModel, SerializerMixin):
    __tablename__ = 'blogs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    link = db.Column(db.String(255), nullable=True)

class PaymentService(BaseModel, SerializerMixin):
    __tablename__ = 'payment_services'
    
    id = db.Column(db.Integer, primary_key=True)
    service_type = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_path = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    
    request_id = db.Column(db.Integer, db.ForeignKey('user_requests.id'), nullable=False)
    user_request = db.relationship('UserRequest', back_populates='payment_services')

    id_admin = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    admin = db.relationship('Admin')
