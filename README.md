# 🤠 Frontier Trading Post

Welcome to the wildest animal trading post this side of the Mississippi! This here establishment helps ya keep track of all yer critter dealings in proper frontier fashion.

## 🐎 Features

- **Strike a Deal**: Generate random sales with our finest selection of frontier animals
- **Buy Stock**: Hand-pick yer own critters, set the quantity, and seal the deal
- **Track Yer Sales**: Keep tabs on every transaction in our fancy ledger
- **Search & Sort**: Find any varmint or customer faster than a rattler's strike
- **Frontier Pricing**: All prices in good ol' 1800s currency
- **Clint's Corner**: Click the snake for some wisdom from the legendary Clint Eastwood

## 🌵 Setup Instructions

1. **Gather Yer Supplies**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Set Up the Trading Post**
```bash
python3 backend/db_init.py
```

3. **Open for Business**
```bash
# Start the backend (Port 5001)
python3 app.py

# In another terminal, start the frontend (Port 8081)
python3 static_server.py
```

4. **Visit the Trading Post**: Mosey on over to `http://localhost:8081`

## 🏹 Tech Stack

- **Frontend**: Pure JavaScript, HTML, CSS (No fancy frameworks needed in the frontier!)
- **Backend**: Flask (Python)
- **Database**: SQLite (Simple and reliable as a trusty steed)

## 🌟 Special Features

- Western-themed name generator
- Period-appropriate pricing
- Quantity tracking for bulk purchases
- Real-time price calculations
- Responsive design that works on any size wagon... err, screen

## 🤝 Contributing

Got some ideas to make this trading post even better? Well saddle up partner, and:
1. Fork this here repository
2. Create yer feature branch
3. Commit yer changes
4. Push to the branch
5. Open a pull request

## 🎯 License

This project is free as a tumbleweed - MIT License

---

*"Sometimes if you want to see a change for the better, you have to take things into your own hands."* - Clint Eastwood 