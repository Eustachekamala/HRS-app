from flask_sqlalchemy import SQLAlchemy  # type: ignore
from sqlalchemy import func, String, Text, Numeric  # type: ignore
from sqlalchemy_serializer import SerializerMixin  # type: ignore
<<<<<<< HEAD


db = SQLAlchemy()

class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(120), nullable=False)
    image_path = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False, default=True)
    create_at = db.Column(db.DateTime, server_default=func.now())
=======
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
>>>>>>> 8f802cacba31075d1ffd5e8ccf934dee322f1491

    user_requests = db.relationship('ClientRequest', back_populates='admin', cascade='all, delete-orphan')

<<<<<<< HEAD
class Technician(db.Model, SerializerMixin):
    __tablename__ = 'technicians'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(120), nullable=False)
    image_path = db.Column(db.String(120), nullable=False)
    occupation = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    create_at = db.Column(db.DateTime, server_default=func.now())
    
    id_admin = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    admin = db.relationship('Admin', back_populates='technicians')

class Service(db.Model, SerializerMixin):
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    service_type = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_path = db.Column(db.String(255), nullable=False)
    create_at = db.Column(db.DateTime, server_default=func.now())
    
    user_requests = db.relationship('UserRequest', back_populates='service')
    id_admin = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    admin = db.relationship('Admin', back_populates='services')
    
    def to_dict(self):
        return {
            'id': self.id,
            'service_type': self.service_type,
            'description': self.description,
            'image_path': self.image_path,
            'create_at': self.create_at.isoformat(),
            'id_admin': self.id_admin,
            'admin': self.admin.to_dict() if self.admin else None
        }
    

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    create_at = db.Column(db.DateTime, server_default=func.now())
    
    user_requests = db.relationship('UserRequest', back_populates='user')


class UserRequest(db.Model, SerializerMixin):
=======
class Technician(User):
    __tablename__ = 'technicians'
    image_path = db.Column(String(255), nullable=False)
    occupation = db.Column(String(100), nullable=True)

    user_requests = db.relationship('ClientRequest', back_populates='technician', cascade='all, delete-orphan')

class Users(User):
    __tablename__ = 'users'

    user_requests = db.relationship('ClientRequest', back_populates='user', cascade='all, delete-orphan')

class Service(BaseModel):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    service_type = db.Column(String(120), nullable=False)
    description = db.Column(Text, nullable=True)
    image_path = db.Column(String(255), nullable=False)

    user_requests = db.relationship('ClientRequest', back_populates='service', cascade='all, delete-orphan')

class ClientRequest(BaseModel):
>>>>>>> 8f802cacba31075d1ffd5e8ccf934dee322f1491
    __tablename__ = 'user_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
<<<<<<< HEAD
    description = db.Column(db.Text, nullable=True)
    create_at = db.Column(db.DateTime, server_default=func.now())
    
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    admin = db.relationship('Admin')
    
    payment_services = db.relationship('PaymentService', back_populates='user_request')
    user = db.relationship('User', back_populates='user_requests')
    service = db.relationship('Service', back_populates='user_requests')



class Blog(db.Model, SerializerMixin):
=======
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    technician_id = db.Column(db.Integer, db.ForeignKey('technicians.id'), nullable=True)
    description = db.Column(Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    user = db.relationship('Users', back_populates='user_requests')
    service = db.relationship('Service', back_populates='user_requests')
    admin = db.relationship('Admin', back_populates='user_requests', lazy='joined')
    technician = db.relationship('Technician', back_populates='user_requests', lazy='joined')

    payment_services = db.relationship('PaymentService', back_populates='user_request', cascade='all, delete-orphan')

class Blog(BaseModel):
>>>>>>> 8f802cacba31075d1ffd5e8ccf934dee322f1491
    __tablename__ = 'blogs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(String(120), nullable=False)
    description = db.Column(Text, nullable=True)
    link = db.Column(String(255), nullable=True)

<<<<<<< HEAD
class PaymentService(db.Model, SerializerMixin):
=======
class PaymentService(BaseModel):
>>>>>>> 8f802cacba31075d1ffd5e8ccf934dee322f1491
    __tablename__ = 'payment_services'
    id = db.Column(db.Integer, primary_key=True)
<<<<<<< HEAD
    service_type = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_path = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    create_at = db.Column(db.DateTime, server_default=func.now())
    
    request_id = db.Column(db.Integer, db.ForeignKey('user_requests.id'), nullable=True)
    user_request = db.relationship('UserRequest', back_populates='payment_services')
=======
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_request_id = db.Column(db.Integer, db.ForeignKey('user_requests.id'), nullable=False)
    phone = db.Column(String(15), nullable=True)
    amount = db.Column(Numeric(10, 2), nullable=False)
>>>>>>> 8f802cacba31075d1ffd5e8ccf934dee322f1491

    user_request = db.relationship('ClientRequest', back_populates='payment_services')
