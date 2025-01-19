# Cursor Rules Practice

A collection of coding exercises and projects using Cursor IDE, featuring an Exotic Animal Sales Tracker application.

## 🦜 Exotic Animal Sales Tracker

A full-stack web application for tracking exotic animal sales, built with Flask and vanilla JavaScript.

### Features
- Real-time sales tracking
- Random sale generation
- Sortable data tables
- Total sales summary
- Support for multiple exotic animals

### Tech Stack
- Frontend: Vanilla JavaScript, HTML5, CSS3
- Backend: Python/Flask
- Database: SQLite
- Development: MacBook Pro M3

### Project Structure
```
animal_sales/
├── backend/
│   ├── __init__.py
│   ├── models.py
│   ├── db_init.py
│   └── animals.py
├── database/
│   └── schema.sql
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── app.py
```

### Quick Start

1. Clone the repository:
```bash
git clone git@github.com:Travbz/cursor-rules-practice.git
cd cursor-rules-practice/animal_sales
```

2. Run the setup script:
```bash
./setup.sh
```

3. Access the application:
- Frontend: http://localhost:8081
- Backend API: http://localhost:5001

### Available Animals
- African Grey Parrot ($1,200)
- Ball Python ($300)
- Bearded Dragon ($150)
- Bengal Cat ($2,500)
- Capybara ($3,000)
- And many more!

### API Endpoints
- `GET /api/sales`: Retrieve all sales
- `POST /api/generate`: Generate a new random sale
- `GET /api/sales/by-animal`: Get sales grouped by animal

## Development

The project uses a structured workflow defined in `.cursorrules` for consistent development practices. 