# server/Dockerfile

FROM python:3.8-slim

WORKDIR /app

# Copy the requirements file
COPY ./server/requirements.txt .

# Install dependencies, including gunicorn
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the application code
COPY ./server .

# Set environment variables (adjust as needed)
ENV FLASK_APP=app.py
ENV FLASK_ENV=development

# Expose the application port
EXPOSE 5000

# Start the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
