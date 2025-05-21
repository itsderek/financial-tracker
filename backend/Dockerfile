# Use the official lightweight Python image.
FROM python:3.11-slim

# Set the working directory.
WORKDIR /app

# Install dependencies.
COPY ./requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy app files.
COPY . .

# Expose FastAPI port and run.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]