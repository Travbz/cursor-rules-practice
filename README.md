# 🤠 Frontier Trading Post

Welcome to the wildest trading post this side of the Mississippi! This here establishment helps track the sale of exotic critters in true western style.

## 🌵 Features

- Strike deals for exotic animals
- Track sales with quantity and pricing
- Filter and sort your transactions
- Generate random sales with western flair
- Buy new stock directly
- File complaints (if you dare! 🤠)

## 🐎 API Documentation

### GET /api/sales
Fetches all sales records from the trading post.

**Response:**
```json
{
    "sales": [
        {
            "id": 1,
            "customer_name": "Wild Bill",
            "animal": "Ornery Bull",
            "quantity": 2,
            "price": 110.00,
            "sale_date": "2024-03-18T10:30:00"
        }
    ]
}
```

### POST /api/sales
Records a new sale at the trading post.

**Request Body:**
```json
{
    "customer_name": "Doc Holliday",
    "animal": "Mean ol' Buckin Bull",
    "quantity": 1,
    "price": 55.00
}
```

### GET /api/animals
Fetches available animals and their prices.

**Response:**
```json
{
    "Ornery Bull": 55.00,
    "Dirty Rotten Mule": 80.00,
    "Wild Mustang": 35.00,
    "Mean ol' Buckin Bull": 60.00
}
```

### POST /api/generate
Generates a random sale with western flair.

**Response:**
```json
{
    "sale": {
        "customer_name": "Quick Draw McGraw",
        "purchases": [
            {
                "animal": "Wild Mustang",
                "quantity": 2,
                "price": 70.00
            }
        ],
        "total": 70.00
    }
}
```

## 🌟 Setup Instructions

### Gather Yer Supplies and Open For Business
```bash
# Create and saddle up your virtual environment
chmod +x setup.sh && ./setup.sh
```


### Set Er A-Burnin'
```bash
# Clean up after yourself
chmod +x cleanup.sh && ./cleanup.sh
```

Visit `http://localhost:8081` to start trading!

## 🎯 Special Features

- Western-themed name generation
- Clint Eastwood quotes
- Surprise for complaint filers
- Full sorting and filtering capabilities

## 🤝 Contributing

Got some ideas to make this trading post even better? Well saddle up partner, and follow these steps:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

Remember: Code like you're in the Wild West - fast, efficient, and with style! 🌵

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

## 🎯 License

This project is free as a tumbleweed - MIT License

---

*"Sometimes if you want to see a change for the better, you have to take things into your own hands."* - Clint Eastwood 