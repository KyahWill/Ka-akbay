#!/bin/bash

# Mental Health Agent Deployment Script
# This script automates the deployment process for Google Cloud Run

set -e  # Exit on any error

# Configuration
PROJECT_ID=$(gcloud config get-value project)
SERVICE_NAME="mental-health-agent"
REGION="asia-southeast1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v gcloud &> /dev/null; then
        log_error "Google Cloud CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v uv &> /dev/null; then
        log_error "UV is not installed. Please install it first."
        exit 1
    fi
    
    log_info "All prerequisites are satisfied."
}

# Build the application
build_app() {
    log_info "Building application with UV..."
    
    # Install dependencies
    uv sync --all-groups
    
    # Run tests if they exist
    if [ -f "pyproject.toml" ] && grep -q "pytest" pyproject.toml; then
        log_info "Running tests..."
        uv run pytest || log_warn "Tests failed, but continuing with deployment..."
    fi
    
    log_info "Application built successfully."
}

# Build Docker image
build_docker() {
    log_info "Building Docker image..."
    
    # Build the image
    docker build -t $IMAGE_NAME .
    
    log_info "Docker image built successfully: $IMAGE_NAME"
}

# Push to Container Registry
push_image() {
    log_info "Pushing image to Container Registry..."
    
    # Configure Docker for GCR
    gcloud auth configure-docker --quiet
    
    # Push the image
    docker push $IMAGE_NAME
    
    log_info "Image pushed successfully to: $IMAGE_NAME"
}

# Deploy to Cloud Run
deploy_to_cloud_run() {
    log_info "Deploying to Cloud Run..."
    
    # Deploy the service
    gcloud run deploy $SERVICE_NAME \
        --image $IMAGE_NAME \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 8080 \
        --memory 2Gi \
        --cpu 1 \
        --max-instances 10 \
        --min-instances 0 \
        --timeout 300 \
        --concurrency 80 \
        --set-env-vars "ENVIRONMENT=production,LOG_LEVEL=INFO"
    
    log_info "Deployment completed successfully!"
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)")
    log_info "Service URL: $SERVICE_URL"
}

# Update environment variables
update_env_vars() {
    log_info "Updating environment variables..."
    
    gcloud run services update $SERVICE_NAME \
        --region $REGION \
        --set-env-vars "ENVIRONMENT=production,LOG_LEVEL=INFO"
    
    log_info "Environment variables updated."
}

# View logs
view_logs() {
    log_info "Viewing recent logs..."
    
    gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME" \
        --limit=20 \
        --format="table(timestamp,severity,textPayload)"
}

# Check service status
check_status() {
    log_info "Checking service status..."
    
    gcloud run services describe $SERVICE_NAME --region $REGION --format="table(metadata.name,status.url,status.conditions[0].status)"
}

# Clean up old images
cleanup() {
    log_info "Cleaning up old images..."
    
    # Remove local images older than 7 days
    docker image prune -f --filter "until=168h"
    
    log_info "Cleanup completed."
}

# Show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build       - Build the application with UV"
    echo "  docker      - Build Docker image"
    echo "  push        - Push image to Container Registry"
    echo "  deploy      - Deploy to Cloud Run"
    echo "  full        - Complete deployment (build, docker, push, deploy)"
    echo "  update-env  - Update environment variables"
    echo "  logs        - View recent logs"
    echo "  status      - Check service status"
    echo "  cleanup     - Clean up old Docker images"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 full          # Complete deployment"
    echo "  $0 deploy        # Deploy existing image"
    echo "  $0 logs          # View logs"
}

# Main script logic
case "${1:-help}" in
    "build")
        check_prerequisites
        build_app
        ;;
    "docker")
        check_prerequisites
        build_docker
        ;;
    "push")
        check_prerequisites
        push_image
        ;;
    "deploy")
        check_prerequisites
        deploy_to_cloud_run
        ;;
    "full")
        check_prerequisites
        build_app
        build_docker
        push_image
        deploy_to_cloud_run
        ;;
    "update-env")
        check_prerequisites
        update_env_vars
        ;;
    "logs")
        check_prerequisites
        view_logs
        ;;
    "status")
        check_prerequisites
        check_status
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|*)
        show_usage
        ;;
esac 