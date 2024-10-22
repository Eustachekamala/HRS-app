from app import app, db  # Import the app instance and db
from models import Admin, Technician, Service, Blog, Users

def seed_data():
    try:
        db.session.begin()

        # Check if the admin already exists
        existing_admin = Admin.query.filter_by(email='admin@example.com').first()
        if existing_admin is None:
            # Create admin only if it doesn't exist
            admin = Admin(username='admin_user', email='admin@example.com', phone='123456789', password='adminpassword', role='admin', image_path='admin.jpg')
            db.session.add(admin)

        # Create technicians
        technicians = [
            Technician(username='tech_user_1', email='tech1@example.com', phone='987654321', password='techpassword', role='technician', image_path='tech1.jpg', occupation='Plumbing'),
            Technician(username='tech_user_2', email='tech2@example.com', phone='456789123', password='techpassword', role='technician', image_path='tech2.jpg', occupation='Electrical'),
            Technician(username='tech_user_3', email='tech3@example.com', phone='321654987', password='techpassword', role='technician', image_path='tech3.jpg', occupation='Carpentry'),
            Technician(username='tech_user_4', email='tech4@example.com', phone='654321789', password='techpassword', role='technician', image_path='tech4.jpg', occupation='HVAC'),
        ]
        db.session.add_all(technicians)
        
        users = [
            Users(username='kamala', email='kamala@example.com', phone='987654321', password='1234@', role='customer',),
            Users(username='kate', email='kate@example.com', phone='456789123', password='12345@', role='technician',),
        ]
        
        db.session.add_all(users)

        # Create services
        services = [
            Service(service_type='Plumbing', description='Fixing pipes and taps', image_path='plumbing.jpg'),
            Service(service_type='Electrical', description='Wiring and repairs', image_path='electrical.jpg'),
            Service(service_type='Carpentry', description='Furniture and structures', image_path='carpentry.jpg'),
            Service(service_type='HVAC', description='Heating and cooling systems', image_path='hvac.jpg'),
            Service(service_type='Landscaping', description='Garden design and maintenance', image_path='landscaping.jpg'),
            Service(service_type='Cleaning', description='Residential and commercial cleaning', image_path='cleaning.jpg'),
        ]
        db.session.add_all(services)

        # Create blog posts
        blog_posts = [
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
        ]
        
        db.session.add_all(blog_posts)

        # Commit the session
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Error seeding data: {e}")

    finally:
        db.session.close()

if __name__ == '__main__':
    with app.app_context():  # Use app context directly
        seed_data()