#!/bin/bash

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "🤠 Whoa there, partner! Seems like Python3 ain't in the corral. Best get that installed first."
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
    echo "🤠 That watering hole's taken ($FLASK_PORT), moseying on to the next one..."
    FLASK_PORT=$((FLASK_PORT + 1))
done
while ! check_port $FRONTEND_PORT; do
    echo "🤠 That hitching post's taken ($FRONTEND_PORT), finding another..."
    FRONTEND_PORT=$((FRONTEND_PORT + 1))
done

echo "🐎 Found ourselves some good spots - Back door: $FLASK_PORT, Front porch: $FRONTEND_PORT"

# Create necessary directories
echo "🌵 Setting up the trading post..."
mkdir -p database

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies using pip
echo "🤠 Gathering supplies..."
pip3 install -r requirements.txt

# Initialize the database
echo "🐄 Setting up the stock ledger..."
python3 backend/db_init.py

# Update the frontend script with the correct backend port
if [ -f frontend/script.js ]; then
    echo "📝 Updating the notice board..."
    # Create a temporary file with the new port
    sed -i.bak "s/localhost:[0-9]\{4\}/localhost:$FLASK_PORT/g" frontend/script.js
    rm -f frontend/script.js.bak
    echo "✅ Trading post signs are up!"
else
    echo "⚠️  Can't find the notice board (frontend/script.js)!"
    exit 1
fi

# Start the backend server in the background with the available port
echo "🌵 Opening the back door on port $FLASK_PORT..."
FLASK_RUN_PORT=$FLASK_PORT python3 app.py &
BACKEND_PID=$!

# Wait for the backend to start
sleep 2

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
    echo "⚠️  The back door's jammed!"
    exit 1
fi

# Start the frontend server
echo "🤠 Opening the front door on port $FRONTEND_PORT..."
STATIC_PORT=$FRONTEND_PORT python3 static_server.py &
FRONTEND_PID=$!

# Wait for the frontend to start
sleep 2

# Check if frontend started successfully
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo "⚠️  The front door won't budge!"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Keep the script running and handle cleanup on interrupt
cleanup() {
    echo "🤠 Closing up shop..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

echo "
🤠 ============================== 🐎
    Frontier Trading Post
    Now Open For Business!
    
    Front Porch: http://localhost:$FRONTEND_PORT
    Back Door:   http://localhost:$FLASK_PORT
============================== 🌵
"

# Wait for either process to exit
while ps -p $BACKEND_PID > /dev/null && ps -p $FRONTEND_PID > /dev/null; do
    sleep 1
done

# If we get here, one of the servers died
echo "⚠️  Looks like something broke down at the trading post!"
cleanup 