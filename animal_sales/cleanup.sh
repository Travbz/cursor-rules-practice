#!/bin/bash

echo "🧹 Cleaning up..."

# Function to kill process using a port
kill_port() {
    local port=$1
    local pid=$(lsof -ti :$port)
    if [ ! -z "$pid" ]; then
        echo "Found process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null || true
    fi
}

# Kill any running Python processes for our app
echo "Stopping running servers..."
pkill -f "python3 static_server.py" || true
pkill -f "python3 app.py" || true

# Clean up ports
echo "Cleaning up ports..."
kill_port 5001
kill_port 8081

# Remove database and temporary files
echo "Removing database..."
rm -rf database/

# Remove virtual environment
echo "Removing virtual environment..."
rm -rf venv/

# Remove any temporary files
echo "Removing temporary files..."
find . -name "*.pyc" -delete
find . -name "__pycache__" -type d -exec rm -r {} +

echo "✨ Cleanup complete!" 