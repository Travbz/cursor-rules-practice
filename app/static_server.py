from flask import Flask, send_from_directory
import os

# Get the absolute path to the frontend directory
frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend')
app = Flask(__name__, static_folder=frontend_dir)

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    port = int(os.environ.get('STATIC_PORT', 8081))
    print(f"🌐 Serving frontend files from: {frontend_dir}")
    app.run(port=port, debug=True)
