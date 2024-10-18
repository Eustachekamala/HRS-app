from app import app, db
from models import Service, Blog, ClientRequest, Client, PaymentService, Admin, Technician

def seed_users():
    if not Admin.query.first():  # Check if any Admin exists
        example_admin = Admin(
            username='admin',
            email='admin@gmail.com',
            phone='+254-719-403-222',
            password='securepassword',
            image_path='uploads/admin.jpg',
            role='admin'
        )
        db.session.add(example_admin)

    if not Technician.query.first():  # Check if any Technician exists
        example_technician = Technician(
            username='Jared',
            password='jared123',
            email='jared@example.com',
            phone='+254-719-405-000',
            image_path='uploads/jared.jpg',
            role='technician',
            occupation='Plumber'
        )
        db.session.add(example_technician)

    if not Client.query.first():  # Check if any Client exists
        example_customer = Client(
            username='customer1',
            password='customer123',
            email='customer@example.com',
            phone='+254-719-405-111',
            role='customer'
        )
        db.session.add(example_customer)

    db.session.commit()
    print("Sample users created!")

def seed_user_requests():
    if not ClientRequest.query.first():  # Check if any UserRequest exists
        # Use the first client created as an example for requests
        example_user = Client.query.first()
        if not example_user:
            print("No Client found, UserRequest cannot be created.")
            return

        # Create a sample service
        example_service = Service(
            service_type='Plumbing',
            description="Our plumbing services cover a wide range of needs.",
            image_path='uploads/plomberie.jpg',
        )
        db.session.add(example_service)
        db.session.commit()  # Commit to get the service ID

        # Creating a user request
        example_request = ClientRequest(
            user_id=example_user.id,  # Use the first user ID
            service_id=example_service.id,  # Use the service ID created above
            description='I need help with plumbing.'
        )
        db.session.add(example_request)
        db.session.commit()  # Commit to get the user request ID

        # Create a sample payment service
        example_payment = PaymentService(
            service_id=example_service.id,  # Use service ID
            customer_id=example_user.id,     # Use customer ID
            user_request_id=example_request.id,  # Assign the user request ID
            amount=100.00,                   # Example amount
            phone='+254-719-405-222'
        )
        db.session.add(example_payment)

        db.session.commit()
        print("Sample UserRequest, Service, and PaymentService created!")
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
        seed_users()         # Seed users first
        seed_user_requests()  # Seed user requests after users
        seed_blogs()         # Seed blogs last

if __name__ == '__main__':
    seed_db()
