from flask_sqlalchemy import SQLAlchemy  # type: ignore
from sqlalchemy import func  # type: ignore
from sqlalchemy_serializer import SerializerMixin  # type: ignore


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

    technicians = db.relationship('Technician', back_populates='admin')
    services = db.relationship('Service', back_populates='admin')

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
    __tablename__ = 'user_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    description = db.Column(db.Text, nullable=True)
    create_at = db.Column(db.DateTime, server_default=func.now())
    
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    admin = db.relationship('Admin')
    
    payment_services = db.relationship('PaymentService', back_populates='user_request')
    user = db.relationship('User', back_populates='user_requests')
    service = db.relationship('Service', back_populates='user_requests')



class Blog(db.Model, SerializerMixin):
    __tablename__ = 'blogs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    link = db.Column(db.String(255), nullable=True)

class PaymentService(db.Model, SerializerMixin):
    __tablename__ = 'payment_services'
    
    id = db.Column(db.Integer, primary_key=True)
    service_type = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_path = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    create_at = db.Column(db.DateTime, server_default=func.now())
    
    request_id = db.Column(db.Integer, db.ForeignKey('user_requests.id'), nullable=True)
    user_request = db.relationship('UserRequest', back_populates='payment_services')

    id_admin = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    admin = db.relationship('Admin')
