# Use the official Python image from the Docker Hub
FROM python:3.8-slim-buster

# Set the working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY app/ .

# Expose the port your backend runs on (e.g., 5555)
EXPOSE 5555

# Command to run your application (adjust as needed)
CMD ["python3", "app.py", "flask", "run", "--host=127.0.0.1", "--port=5555", "--debug=False"]
