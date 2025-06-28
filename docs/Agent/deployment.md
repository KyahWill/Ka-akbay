# Mental Health Agent Deployment Guide

This document provides comprehensive instructions for deploying the Mental Health Agent application on Google Cloud Run and building/testing it using UV.

## Table of Contents

1. [Application Overview](#application-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development with UV](#local-development-with-uv)
4. [Building the Application](#building-the-application)
5. [Testing with UV](#testing-with-uv)
6. [Google Cloud Run Deployment](#google-cloud-run-deployment)
7. [Environment Configuration](#environment-configuration)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Troubleshooting](#troubleshooting)

## Application Overview

The Mental Health Agent is a FastAPI-based application that provides:
- Mental health counseling and support
- Information about mental health resources
- Coordination with healthcare providers and support groups
- Crisis intervention and emergency contact information

**Key Components:**
- **Framework**: FastAPI with Google ADK (Agent Development Kit)
- **Language Model**: Gemini 2.0 Flash
- **Package Manager**: UV (modern Python package manager)
- **Container**: Docker with Python 3.12
- **Port**: 8080 (configurable via PORT environment variable)

## Prerequisites

### Required Tools
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- [Docker](https://docs.docker.com/get-docker/)
- [UV](https://docs.astral.sh/uv/getting-started/installation/)
- [Python 3.13+](https://www.python.org/downloads/)

### Google Cloud Setup
1. **Install Google Cloud CLI**:
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Or download from https://cloud.google.com/sdk/docs/install
   ```

2. **Initialize and authenticate**:
   ```bash
   gcloud init
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Enable required APIs**:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

4. **Set up authentication for Docker**:
   ```bash
   gcloud auth configure-docker
   ```

## Local Development with UV

### 1. Install Dependencies

Navigate to the agent directory and install dependencies:

```bash
cd agent
uv sync --all-groups
```

### 2. Activate Virtual Environment

```bash
source .venv/bin/activate
```

### 3. Run the Application Locally

```bash
# Using UV
uv run python main.py

# Or using the ADK CLI
uv run adk web --port 8080 --host 0.0.0.0
```

The application will be available at `http://localhost:8080`

## Building the Application

### 1. Using UV for Local Build

```bash
# Ensure all dependencies are installed
uv sync --all-groups

# Run tests (if available)
uv run pytest

# Build the application
uv run python -m py_compile main.py
```

### 2. Docker Build

```bash
# Build the Docker image
docker build -t mental-health-agent .

# Test the Docker image locally
docker run -p 8080:8080 mental-health-agent
```

### 3. Build for Production

```bash
# Build with production optimizations
docker build --target production -t mental-health-agent:prod .

# Or build with specific platform
docker build --platform linux/amd64 -t mental-health-agent .
```

## Testing with UV

### 1. Unit Testing

```bash
# Install test dependencies
uv add --dev pytest pytest-asyncio httpx

# Run tests
uv run pytest

# Run with coverage
uv run pytest --cov=root_agent --cov-report=html
```

### 2. Integration Testing

```bash
# Test the FastAPI application
uv run python -m pytest tests/ -v

# Test specific endpoints
uv run python -c "
import requests
response = requests.get('http://localhost:8080/health')
print(response.status_code)
"
```

### 3. Load Testing

```bash
# Install load testing tools
uv add --dev locust

# Run load test
uv run locust -f load_test.py --host=http://localhost:8080
```

## Google Cloud Run Deployment

### 1. Build and Push to Container Registry

```bash
# Set your project ID
export PROJECT_ID=$(gcloud config get-value project)

# Build and tag the image
docker build -t gcr.io/$PROJECT_ID/mental-health-agent .

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/mental-health-agent
```

### 2. Deploy to Cloud Run

```bash
# Deploy the service
gcloud run deploy mental-health-agent \
  --image gcr.io/$PROJECT_ID/mental-health-agent \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 0 \
  --timeout 300 \
  --concurrency 80
```

### 3. Advanced Deployment Options

```bash
# Deploy with custom environment variables
gcloud run deploy mental-health-agent \
  --image gcr.io/$PROJECT_ID/mental-health-agent \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars "ENVIRONMENT=production,LOG_LEVEL=INFO" \
  --set-secrets "API_KEY=api-key:latest" \
  --memory 4Gi \
  --cpu 2 \
  --max-instances 20
```

### 4. Continuous Deployment with Cloud Build

Create a `cloudbuild.yaml` file:

```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/mental-health-agent:$COMMIT_SHA', '.']
  
  # Push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/mental-health-agent:$COMMIT_SHA']
  
  # Deploy container image to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'mental-health-agent'
      - '--image'
      - 'gcr.io/$PROJECT_ID/mental-health-agent:$COMMIT_SHA'
      - '--region'
      - 'asia-southeast1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/mental-health-agent:$COMMIT_SHA'
```

Trigger the build:

```bash
gcloud builds submit --config cloudbuild.yaml
```

## Environment Configuration

### 1. Environment Variables

Create a `.env` file for local development:

```bash
# Application Configuration
ENVIRONMENT=development
LOG_LEVEL=DEBUG
PORT=8080

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Model Configuration
GEMINI_API_KEY=your-gemini-api-key
MODEL_NAME=gemini-2.0-flash

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 2. Cloud Run Environment Variables

Set environment variables in Cloud Run:

```bash
gcloud run services update mental-health-agent \
  --region asia-southeast1 \
  --set-env-vars "ENVIRONMENT=production,LOG_LEVEL=INFO"
```

### 3. Secrets Management

Store sensitive data in Google Secret Manager:

```bash
# Create secrets
echo -n "your-api-key" | gcloud secrets create gemini-api-key --data-file=-

# Grant access to Cloud Run service
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:mental-health-agent@your-project.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Reference in deployment
gcloud run deploy mental-health-agent \
  --image gcr.io/$PROJECT_ID/mental-health-agent \
  --set-secrets "GEMINI_API_KEY=gemini-api-key:latest"
```

## Monitoring and Logging

### 1. Cloud Logging

View logs in real-time:

```bash
# Stream logs
gcloud logs tail --project=$PROJECT_ID --filter="resource.type=cloud_run_revision"

# View specific service logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=mental-health-agent" --limit=50
```

### 2. Cloud Monitoring

Set up monitoring dashboards:

```bash
# Create uptime check
gcloud monitoring uptime-checks create http mental-health-agent-check \
  --uri=https://mental-health-agent-xxxxx-uc.a.run.app/health \
  --display-name="Mental Health Agent Uptime Check"
```

### 3. Error Reporting

Enable error reporting:

```bash
# Install error reporting library
uv add google-cloud-error-reporting

# Add to your application
import google.cloud.error_reporting

error_client = google.cloud.error_reporting.Client()
```

## Troubleshooting

### Common Issues

1. **Port Configuration**:
   ```bash
   # Ensure PORT environment variable is set
   export PORT=8080
   ```

2. **Memory Issues**:
   ```bash
   # Increase memory allocation
   gcloud run services update mental-health-agent \
     --memory 4Gi \
     --region asia-southeast1
   ```

3. **Cold Start Performance**:
   ```bash
   # Set minimum instances to reduce cold starts
   gcloud run services update mental-health-agent \
     --min-instances 1 \
     --region asia-southeast1
   ```

4. **Dependency Issues**:
   ```bash
   # Clean and reinstall dependencies
   rm -rf .venv
   uv sync --all-groups
   ```

### Debug Commands

```bash
# Check service status
gcloud run services describe mental-health-agent --region asia-southeast1

# View recent revisions
gcloud run revisions list --service=mental-health-agent --region asia-southeast1

# Check logs for specific revision
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.revision_name=mental-health-agent-00001-abc" --limit=10
```

### Performance Optimization

1. **Container Optimization**:
   - Use multi-stage builds
   - Minimize layer count
   - Use .dockerignore to exclude unnecessary files

2. **Application Optimization**:
   - Enable connection pooling
   - Implement caching strategies
   - Use async operations where possible

3. **Cloud Run Optimization**:
   - Set appropriate concurrency limits
   - Use regional deployments
   - Implement health checks

## Security Considerations

1. **Authentication**: Implement proper authentication for production
2. **HTTPS**: Cloud Run provides HTTPS by default
3. **Secrets**: Use Google Secret Manager for sensitive data
4. **CORS**: Configure CORS properly for your domain
5. **Rate Limiting**: Implement rate limiting for API endpoints

## Cost Optimization

1. **Resource Allocation**: Start with minimal resources and scale as needed
2. **Auto-scaling**: Use min-instances=0 for cost savings
3. **Regional Deployment**: Choose regions close to your users
4. **Monitoring**: Set up billing alerts

---

For additional support, refer to:
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [UV Documentation](https://docs.astral.sh/uv/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Google ADK Documentation](https://developers.google.com/adk)
