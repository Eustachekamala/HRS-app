# HRS-app

### Project description
HRS-app is a web application that allows users to register, login, and view their personal information. The application uses Flask, Flask-SQLAlchemy, and Flask-Migrate for database management. The application also uses JWT for authentication....

## Project dependencies
  - flask
  - flask-sqlalchemy
  - flask-migrate

## Project commands
  - flask db init
  - flask db migrate
  - flask db upgrade    
  - flask run

## Project resources
  - https://flask.palletsprojects.com/en/1.1.x/
  - https://www.digitalocean.com/community/tutorials/how-to-use-flask-with-sqlalchemy-and-jwt-authentication
  - https://www.digitalocean.com/community/tutorials/how-to-use-flask-with-sqlalchemy-and-jwt-authentication



### Project features
- JWT authentication
- User registration
- Service Provider Profiles
- Request Home Repair Services
- Local Repair Service Listings
- Database management with Flask-SQLAlchemy
- Database migration with Flask-Migrate

### Project status
The project is currently in development and has not been tested extensively. However, it is functional and can be used as a starting point for further development.

### Project requirements
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- JWT

### Project installation
1. Clone the repository to your local machine.
2. To install the required dependencies for the server, navigate to the server folder and run the following command:
    ```
        pip/pip3 install -r requirements.txt
    ``` 
4. To install the required dependencies for the client, navigate to the client folder and run the following command:
    ```
        npm install
    ```
5. To create the database tables, run the following command:
    ```
        flask db init
        flask db migrate
        flask db upgrade
    ```
6. To start the development server, run the following command:
    ```
        honcho start -f Procfile.dev
    ```
7. Open your browser and navigate to http://localhost:3000 to access the client application.
8. You can now make changes to the client application and see the changes reflected in the browser.
9. To stop the development server, run this command:
    ```
        honcho stop -f Procfile.dev
    ```
10. To seed the database with sample data, run this command:
    ```
        python seed.py
    ```
11. To start the production server, run this command:
    ```
        honcho start -f Procfile
    ```
12. To stop the production server, run this command:
    ```
        honcho stop -f Procfile
    ```
13. To run the application in production mode, run this command:
    ```
        gunicorn -b 127.0.0.1:5555 --chdir ./server app:app --reload
    ```
14. Open your browser and navigate to http://localhost:5555 to access the application.

## User Guide

### Sign Up
1. Open the application in your browser.
2. Click on the "Sign Up" button.
3. Fill in the required fields and click on the "Sign Up" button.
4. You will be redirected to the home page.

### Login
1. Open the application in your browser.
2. Click on the "Login" button.
3. Fill in the required fields and click on the "Login" button.
4. You will be redirected to the home page.

### Home Page
1. Open the application in your browser.
2. You will be redirected to the home page.
3. You can view the list of services, blogs, and requests.
4. You can also view the profile of the logged-in user.

### Service Request
1. Open the application in your browser.
2. Click on the "Request Service" button.
3. Fill in the required fields and click on the "Request Service" button.
4. You will be redirected to the home page.
5. You can view the list of services, blogs, and requests.
6. You can also view the profile of the logged-in user.

### Profile
1. Open the application in your browser.
2. Click on the "Profile" button.
3. You will be redirected to the profile page.
4. You can view the list of services, blogs, and requests.
5. You can also view the profile of the logged-in user.

### Logout
1. Open the application in your browser.
2. Click on the "Logout" button.
3. You will be redirected to the home page.
4. You can view the list of services, blogs, and requests.
5. You can also view the profile of the logged-in user.

### Admin Dashboard
1. Open the application in your browser.
2. Click on the "Admin Dashboard" button.
3. You will be redirected to the admin dashboard.
4. You can view the list of services, blogs, and requests.
5. You can also view the profile of the logged-in user.
6. You can view the list of admins and technicians.
7. You can also view the profile of the logged-in user.

### Technician Dashboard
1. Open the application in your browser.
2. Click on the "Technician Dashboard" button.
3. You will be redirected to the technician dashboard.
4. You can view the list of services and requests.
5. You can also view the profile of the logged-in user.
6. You can view the list of admins and technicians.
7. You can also view the profile of the logged-in user.

### Service Page
1. Open the application in your browser.
2. Click on the "Service" button.
3. You will be redirected to the service page.
4. You can view the list of services, blogs, and requests.
5. You can also view the profile of the logged-in user.
6. You can view the list of admins and technicians.
7. You can also view the profile of the logged-in user.
8. You can view the list of payments.
9. You can also view the profile of the logged-in user.

## License
    MIT License

    Copyright (c) 2023 Eustache

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.