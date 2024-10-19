from flask_sqlalchemy import SQLAlchemy  # type: ignore
from sqlalchemy import func, String, Text, Numeric  # type: ignore
from sqlalchemy_serializer import SerializerMixin  # type: ignore
from datetime import datetime
from sqlalchemy.ext.declarative import declared_attr

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

class User(BaseModel):
    """Base class for users (Admin, Technician, Client) with shared fields."""
    __abstract__ = True

    @declared_attr
    def id(cls):
        return db.Column(db.Integer, primary_key=True)

    @declared_attr
    def username(cls):
        return db.Column(String(80), nullable=False)

    @declared_attr
    def email(cls):
        return db.Column(String(120), unique=True, nullable=False)

    @declared_attr
    def phone(cls):
        return db.Column(String(15), nullable=True)

    @declared_attr
    def password(cls):
        return db.Column(String(128), nullable=False)

    @declared_attr
    def role(cls):
        return db.Column(String(20), nullable=False)

    @declared_attr
    def created_at(cls):
        return db.Column(db.DateTime(timezone=True), server_default=func.now())

class Admin(User):
    __tablename__ = 'admins'
    image_path = db.Column(String(255), nullable=True)

    user_requests = db.relationship('ClientRequest', back_populates='admin', cascade='all, delete-orphan')

class Technician(User):
    __tablename__ = 'technicians'
    image_path = db.Column(String(255), nullable=False)
    occupation = db.Column(String(100), nullable=True)

    user_requests = db.relationship('ClientRequest', back_populates='technician', cascade='all, delete-orphan')

class Client(User):
    __tablename__ = 'clients'

    user_requests = db.relationship('ClientRequest', back_populates='user', cascade='all, delete-orphan')

class Service(BaseModel):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    service_type = db.Column(String(120), nullable=False)
    description = db.Column(Text, nullable=True)
    image_path = db.Column(String(255), nullable=False)

    user_requests = db.relationship('ClientRequest', back_populates='service', cascade='all, delete-orphan')

class ClientRequest(BaseModel):
    __tablename__ = 'user_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    technician_id = db.Column(db.Integer, db.ForeignKey('technicians.id'), nullable=True)
    description = db.Column(Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    user = db.relationship('Client', back_populates='user_requests')
    service = db.relationship('Service', back_populates='user_requests')
    admin = db.relationship('Admin', back_populates='user_requests', lazy='joined')
    technician = db.relationship('Technician', back_populates='user_requests', lazy='joined')

    payment_services = db.relationship('PaymentService', back_populates='user_request', cascade='all, delete-orphan')

class Blog(BaseModel):
    __tablename__ = 'blogs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(String(120), nullable=False)
    description = db.Column(Text, nullable=True)
    link = db.Column(String(255), nullable=True)

class PaymentService(BaseModel):
    __tablename__ = 'payment_services'
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    user_request_id = db.Column(db.Integer, db.ForeignKey('user_requests.id'), nullable=False)
    phone = db.Column(String(15), nullable=True)
    amount = db.Column(Numeric(10, 2), nullable=False)

    user_request = db.relationship('ClientRequest', back_populates='payment_services')
