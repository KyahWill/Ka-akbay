#!/bin/bash

# Start ADK Server Script
# This script helps start the ADK server for the mental health agent

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Check if we're in the right directory
if [ ! -d "agent" ]; then
    log_error "Agent directory not found. Please run this script from the project root."
    exit 1
fi

# Navigate to agent directory
cd agent

# Check if UV is installed
if ! command -v uv &> /dev/null; then
    log_error "UV is not installed. Please install it first: https://docs.astral.sh/uv/getting-started/installation/"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    log_info "Creating virtual environment..."
    uv venv
fi

# Install dependencies
log_info "Installing dependencies..."
uv sync --all-groups

# Activate virtual environment and start ADK server
log_info "Starting ADK server..."
log_info "The server will be available at: http://localhost:8000"
log_info "Press Ctrl+C to stop the server"
echo ""

# Start the ADK API server
uv run adk api_server 