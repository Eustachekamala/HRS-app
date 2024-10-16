FROM python:3.8-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file from the server directory
COPY ./server/requirements.txt ./server/requirements.txt

# Install dependencies
RUN pip3 install --no-cache-dir -r ./server/requirements.txt

# Copy the application code
COPY ./server ./server

# Set environment variables
ENV FLASK_APP=server/app.py
ENV FLASK_ENV=development

# Expose the application port
EXPOSE 5000

# Start the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server.app:app"]
