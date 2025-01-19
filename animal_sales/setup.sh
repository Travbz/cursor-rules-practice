#!/bin/bash

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is required but not installed. Please install Python3 first."
    exit 1
fi

# Make sure we're in the project root
cd "$(dirname "$0")"

# Add current directory to PYTHONPATH
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Function to check if a port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 1
    else
        return 0
    fi
}

# Find available ports
FLASK_PORT=5001
FRONTEND_PORT=8081
while ! check_port $FLASK_PORT; do
    echo "Port $FLASK_PORT is taken, trying next port..."
    FLASK_PORT=$((FLASK_PORT + 1))
done
while ! check_port $FRONTEND_PORT; do
    echo "Port $FRONTEND_PORT is taken, trying next port..."
    FRONTEND_PORT=$((FRONTEND_PORT + 1))
done

echo "🎯 Found available ports - Backend: $FLASK_PORT, Frontend: $FRONTEND_PORT"

# Create necessary directories
echo "🚀 Setting up project structure..."
mkdir -p database

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies using pip
pip3 install -r requirements.txt

# Initialize the database
python3 backend/db_init.py

# Update the frontend script with the correct backend port
if [ -f frontend/script.js ]; then
    echo "📝 Updating API port in frontend/script.js..."
    # Create a temporary file with the new port
    sed -i.bak "s/localhost:[0-9]\{4\}/localhost:$FLASK_PORT/g" frontend/script.js
    rm -f frontend/script.js.bak
    echo "✅ Frontend configuration updated successfully"
else
    echo "⚠️  frontend/script.js not found!"
    exit 1
fi

# Start the backend server in the background with the available port
echo "🌐 Starting backend server on port $FLASK_PORT..."
FLASK_RUN_PORT=$FLASK_PORT python3 app.py &
BACKEND_PID=$!

# Wait for the backend to start
sleep 2

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
    echo "⚠️  Backend server failed to start!"
    exit 1
fi

# Start the frontend server
echo "🌐 Starting frontend server on port $FRONTEND_PORT..."
STATIC_PORT=$FRONTEND_PORT python3 static_server.py &
FRONTEND_PID=$!

# Wait for the frontend to start
sleep 2

# Check if frontend started successfully
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo "⚠️  Frontend server failed to start!"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Keep the script running and handle cleanup on interrupt
cleanup() {
    echo "Cleaning up..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Wait for either process to exit
while ps -p $BACKEND_PID > /dev/null && ps -p $FRONTEND_PID > /dev/null; do
    sleep 1
done

# If we get here, one of the servers died
echo "⚠️  One of the servers exited unexpectedly"
cleanup 