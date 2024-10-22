from app import app, db
from models import Service, Blog, ClientRequest, Users, PaymentService, Admin, Technician
from werkzeug.security import generate_password_hash  # type: ignore

def seed_users():
    if not Admin.query.first():
        example_admin = Admin(
            username='admin',
            email='admin@gmail.com',
            phone='+254-719-403-222',
            password=generate_password_hash('securepassword'),
            image_path='uploads/admin.jpg',
            role='admin'
        )
        db.session.add(example_admin)

    technicians = [
        Technician(
            username='Jared',
            password=generate_password_hash('jared123'), 
            email='jared@example.com',
            phone='+254-719-405-000',
            image_path='uploads/jared.jpg',
            role='technician',
            occupation='Plumber',
            history='I have been a plumber for 10 years.',
            realizations=10
        ),
        Technician(
            username='Alice',
            password=generate_password_hash('alice123'),
            email='alice@example.com',
            phone='+254-719-405-001',
            image_path='uploads/alice.jpg',
            role='technician',
            occupation='Electrician',
            history='Experienced electrician with over 8 years in the field.',
            realizations=15
        ),
        Technician(
            username='Bob',
            password=generate_password_hash('bob123'),
            email='bob@example.com',
            phone='+254-719-405-665',
            image_path='uploads/bob.jpg',
            role='technician',
            occupation='HVAC Specialist',
            history='Specializing in heating and cooling systems for 12 years.',
            realizations=20
        ),
        Technician(
            username='Claire',
            password=generate_password_hash('claire123'),
            email='claire@example.com',
            phone='+254-719-456-043',
            image_path='uploads/claire.jpg',
            role='technician',
            occupation='Carpenter',
            history='Skilled carpenter with 15 years of experience.',
            realizations=25
        ),
        Technician(
            username='David',
            password=generate_password_hash('david123'),
            email='david@example.com',
            phone='+254-719-433-033',
            image_path='uploads/david.jpg',
            role='technician',
            occupation='Mason',
            history='Mason with extensive experience in residential and commercial projects.',
            realizations=30
        ),
        Technician(
            username='Eva',
            password=generate_password_hash('eva123'),
            email='eva@example.com',
            phone='+254-719-505-035',
            image_path='uploads/eva.jpg',
            role='technician',
            occupation='Roofer',
            history='Experienced roofer with a focus on quality and safety.',
            realizations=18
        )
    ]

    for tech in technicians:
        db.session.add(tech)

    if not Users.query.first():
        example_customer = Users(
        username='victoria',
        password=generate_password_hash('customer123'),
        email='victoria@example.com',
        phone='+254-719-405-111',
        role='customer'
    )
    db.session.add(example_customer)
    
    # Create an admin user as well
    example_admin = Users(
        username='eustache',
        password=generate_password_hash('eustache123@'),
        email='eustache@gmail.com',
        phone='+254-719-405-222',
        role='admin'
    )
    db.session.add(example_admin)

    db.session.commit()

    print("Sample users created!")

def seed_user_requests():
    if not ClientRequest.query.first():
        example_user = Users.query.first()
        if not example_user:
            print("No Users found, UserRequest cannot be created.")
            return

        # Create six services related to engineering repairs
        services = [
            Service(
                service_type='Plumbing',
                description="Our plumbing services cover a wide range of needs.",
                image_path='uploads/plomberie.jpg',
            ),
            Service(
                service_type='Electrical Work',
                description="Expert electrical services for all your needs.",
                image_path='uploads/electrical.jpg',
            ),
            Service(
                service_type='HVAC Repair',
                description="Efficient heating and cooling system repairs.",
                image_path='uploads/hvac.jpg',
            ),
            Service(
                service_type='Carpentry',
                description="Custom carpentry solutions for your home.",
                image_path='uploads/carpentry.jpg',
            ),
            Service(
                service_type='Masonry',
                description="Professional masonry for durable structures.",
                image_path='uploads/masonry.jpg',
            ),
            Service(
                service_type='Roofing',
                description="Reliable roofing solutions to protect your home.",
                image_path='uploads/roofing.jpg',
            )
        ]

        db.session.bulk_save_objects(services)
        db.session.commit()

        example_service = Service.query.first()

        example_request = ClientRequest(
            user_id=example_user.id,
            service_id=example_service.id,
            description='I need help with plumbing.'
        )
        db.session.add(example_request)
        db.session.commit()

        example_payment = PaymentService(
            service_id=example_service.id,
            customer_id=example_user.id,
            user_request_id=example_request.id,
            amount=100.00,
            phone='+254-719-405-222'
        )
        db.session.add(example_payment)

        db.session.commit()
        print("Sample UserRequest, Services, and PaymentService created!")
    else:
        print("UserRequest already exists, skipping creation.")

def seed_blogs():
    if not Blog.query.first():
        blogs = [
            Blog(title='How to Choose the Right Home Repair Service', 
                 description='Finding a reliable home repair service can be challenging. Here are some tips to help you make the best choice...', 
                 link='https://www.jimthehandyman.com/tips-for-choosing-best-handyman-service/#:~:text=The%20company%20that%20offers%20the,to%20avoid%20any%20future%20bummer.'),
            Blog(title='Top 5 Home Maintenance Tips', 
                 description='Maintaining your home is essential for its longevity. Check out these top five tips to keep your home in shape...', 
                 link='https://www.kwikom.com/blog/homeowners-hub/2024/05/23/5-home-maintenance-tips-every-homeowner-should-follow/'),
            Blog(title='DIY Home Repair: When to Call a Professional', 
                 description='Not all home repairs are DIY. Learn when to tackle a job yourself and when to call in an expert.', 
                 link='https://www.fbfs.com/learning-center/diy-or-call-a-professional#:~:text=If%20a%20home%20renovation%20project,quickly%2C%20consider%20calling%20a%20professional.'),
            Blog(title='Seasonal Home Maintenance Checklist', 
                 description='Keep your home in great shape year-round with our seasonal maintenance checklist.', 
                 link='https://www.bhg.com/home-improvement/advice/home-maintenance-checklist/'),
            Blog(title='How to Budget for Home Repairs', 
                 description='Learn how to create a budget for home repairs and avoid unexpected costs.', 
                 link='https://www.statefarm.com/simple-insights/residence/how-to-budget-and-save-for-home-maintenance#:~:text=Set%20aside%20a%20portion%20of,for%20a%20home%20maintenance%20fund.')
        ]
        
        db.session.bulk_save_objects(blogs)
        db.session.commit()
        print("Blogs seeded!")
    else:
        print("Blogs already exist, skipping creation.")

def seed_db():
    with app.app_context():
        db.create_all()
        seed_users()
        seed_user_requests()
        seed_blogs()

if __name__ == '__main__':
    seed_db()