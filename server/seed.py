from app import app, db
from models import Service, Blog, UserRequest, Admin, Technician

def seed_admin():
    if not Admin.query.first():
        example_admin = Admin(
            username='admin',
            password='admin123',
            email='admin@example.com',
            phone='+254-719-405-100',
            image_path='uploads/default_admin.jpg'
        )
        db.session.add(example_admin)
        db.session.commit()
        print("Sample Admin created!")

def seed_technicians():
    if not Technician.query.first():
        example_admin = Admin.query.first()
        if example_admin:
            example_technician = Technician(
                username='Jared',
                password='jared123',
                email='jared@example.com',
                phone='+254-719-405-000',
                image_path='uploads/jared.jpg',
                occupation='Plumber',
                id_admin=example_admin.id 
            )
            db.session.add(example_technician)
            db.session.commit()
            print("Sample Technician created!")
        else:
            print("No Admin found, Technician cannot be created.")

def seed_user_requests():
    if not UserRequest.query.first():
        example_admin = Admin.query.first()
        if not example_admin:
            print("No Admin found, UserRequest cannot be created.")
            return

        # Adjust user_id and service_id as needed
        example_request = UserRequest(
            user_id=1,  # Ensure this user exists
            service_id=1,  # Ensure this service exists
            description='I need help with plumbing.',
            admin_id=example_admin.id
        )
        db.session.add(example_request)

        example_service_request = Service(
            service_type='Plumbing',
            description="Our plumbing services cover a wide range of needs to ensure that your home runs smoothly. Whether you're dealing with a leaky faucet, a clogged drain, or a complete plumbing installation, our team of experienced plumbers is here to help.",
            image_path='uploads/plomberie.jpg',
            id_admin=example_admin.id
        )
        db.session.add(example_service_request)
        
        db.session.commit()
        print("Sample UserRequest and Service created!")
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
        seed_admin()
        seed_technicians()
        seed_user_requests()
        seed_blogs()

if __name__ == '__main__':
    seed_db()
