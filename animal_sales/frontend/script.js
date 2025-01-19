const CLINT_QUOTES = [
    "Every man's got a right to be a sucker... once.",
    "You see, in this world there's two kinds of people, my friend: Those with loaded guns and those who dig. You dig.",
    "Go ahead, make my day.",
    "You've got to ask yourself one question: 'Do I feel lucky?' Well, do ya, punk?",
    "I have a very strict gun control policy: if there's a gun around, I want to be in control of it.",
    "Sometimes if you want to see a change for the better, you have to take things into your own hands."
];

let currentSort = { field: 'id', ascending: true };
let salesData = [];
let filteredData = [];

// Buy Stock Modal functionality
const modal = document.getElementById('buyStockModal');
const buyStockBtn = document.getElementById('buyStock');
const closeBtn = document.getElementsByClassName('close')[0];
const animalSelect = document.getElementById('animalSelect');
const priceDisplay = document.getElementById('priceDisplay');
const quantityInput = document.getElementById('quantity');
const buyStockForm = document.getElementById('buyStockForm');

// Animal prices from backend
let animalPrices = {};

// Fetch animal prices and populate select
async function fetchAnimalPrices() {
    try {
        const response = await fetch('http://localhost:5001/api/animals');
        animalPrices = await response.json();
        populateAnimalSelect();
    } catch (error) {
        console.error('Error fetching animal prices:', error);
    }
}

function toggleTheme() {
    // This function is removed as per the instructions
}

function applyFilters() {
    const bountyHunterFilter = document.getElementById('bountyHunterFilter').value.toLowerCase();
    const varmintFilter = document.getElementById('varmintFilter').value.toLowerCase();
    const minReward = parseFloat(document.getElementById('priceFilter').value) || 0;
    const dateFilter = document.getElementById('dateFilter').value;

    filteredData = salesData.filter(sale => {
        const matchesBountyHunter = sale.customer_name.toLowerCase().includes(bountyHunterFilter);
        const matchesVarmint = sale.animal.toLowerCase().includes(varmintFilter);
        const matchesReward = sale.price >= minReward;
        
        let matchesDate = true;
        if (dateFilter !== 'all') {
            const saleDate = new Date(sale.sale_date);
            const today = new Date();
            const timeDiff = today - saleDate;
            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

            switch(dateFilter) {
                case 'today':
                    matchesDate = daysDiff < 1;
                    break;
                case 'week':
                    matchesDate = daysDiff < 7;
                    break;
                case 'month':
                    matchesDate = daysDiff < 30;
                    break;
            }
        }

        return matchesBountyHunter && matchesVarmint && matchesReward && matchesDate;
    });

    updateTable();
    updateSummary();
}

function clearFilters() {
    document.getElementById('bountyHunterFilter').value = '';
    document.getElementById('varmintFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('dateFilter').value = 'all';
    
    filteredData = [...salesData];
    updateTable();
    updateSummary();
}

async function fetchSales() {
    try {
        const response = await fetch('http://localhost:5001/api/sales');
        const data = await response.json();
        salesData = data.sales;
        filteredData = [...salesData];
        updateTable();
        updateSummary();
    } catch (error) {
        console.error('Error fetching sales:', error);
    }
}

async function generateSale() {
    try {
        const response = await fetch('http://localhost:5001/api/generate', {
            method: 'POST'
        });
        await fetchSales();
    } catch (error) {
        console.error('Error generating sale:', error);
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function formatPrice(price) {
    return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}

function updateSummary() {
    const totalSales = filteredData.reduce((sum, sale) => sum + sale.price, 0);
    document.getElementById('totalSales').textContent = formatPrice(totalSales).slice(1);
    document.getElementById('totalTransactions').textContent = filteredData.length;
}

function sortData(field) {
    if (currentSort.field === field) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.field = field;
        currentSort.ascending = true;
    }

    filteredData.sort((a, b) => {
        let comparison = 0;
        if (field === 'price') {
            comparison = a[field] - b[field];
        } else if (field === 'sale_date') {
            comparison = new Date(a[field]) - new Date(b[field]);
        } else {
            comparison = String(a[field]).localeCompare(String(b[field]));
        }
        return currentSort.ascending ? comparison : -comparison;
    });

    updateTable();
}

function updateTable() {
    const tbody = document.getElementById('salesTable');
    tbody.innerHTML = '';

    filteredData.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.customer_name}</td>
            <td>${sale.animal}</td>
            <td>${sale.quantity}</td>
            <td>${formatPrice(sale.price)}</td>
            <td>${formatDate(sale.sale_date)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Populate animal select options
function populateAnimalSelect() {
    animalSelect.innerHTML = '<option value="">Select an animal...</option>';
    Object.entries(animalPrices).forEach(([animal, price]) => {
        const option = document.createElement('option');
        option.value = animal;
        option.textContent = `${animal} - $${price}`;
        animalSelect.appendChild(option);
    });
}

// Update price display when animal or quantity changes
function updatePriceDisplay() {
    const selectedAnimal = animalSelect.value;
    const quantity = parseInt(quantityInput.value) || 0;
    const price = animalPrices[selectedAnimal] || 0;
    const totalPrice = price * quantity;
    priceDisplay.textContent = formatPrice(totalPrice);
}

// Event listeners for price updates
animalSelect.addEventListener('change', updatePriceDisplay);
quantityInput.addEventListener('input', updatePriceDisplay);

// Modal controls
buyStockBtn.onclick = () => {
    modal.style.display = 'block';
};

closeBtn.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Handle form submission
buyStockForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const selectedAnimal = animalSelect.value;
    const quantity = parseInt(quantityInput.value) || 1;
    
    const formData = {
        customer_name: document.getElementById('customerName').value,
        animal: selectedAnimal,
        quantity: quantity,
        price: animalPrices[selectedAnimal] * quantity
    };

    try {
        const response = await fetch('http://localhost:5001/api/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            modal.style.display = 'none';
            buyStockForm.reset();
            await fetchSales();
        } else {
            console.error('Error submitting form:', await response.text());
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Snake quote functionality
    const snakeQuote = document.getElementById('snakeQuote');
    const quoteText = document.getElementById('quoteText');
    let isQuoteVisible = false;

    snakeQuote.addEventListener('click', () => {
        if (!isQuoteVisible) {
            const randomQuote = CLINT_QUOTES[Math.floor(Math.random() * CLINT_QUOTES.length)];
            quoteText.textContent = randomQuote;
            quoteText.style.display = 'block';
            isQuoteVisible = true;
        } else {
            quoteText.style.display = 'none';
            isQuoteVisible = false;
        }
    });

    // Complaint button rickroll with direct redirect
    document.getElementById('fileComplaint').addEventListener('click', () => {
        window.location.href = "https://www.youtube.com/watch?v=xvFZjo5PgG0&autoplay=1&fs=1";
    });

    document.getElementById('generateSale').addEventListener('click', generateSale);
    
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            sortData(th.dataset.sort);
        });
    });

    // Add filter event listeners
    const filterInputs = ['bountyHunterFilter', 'varmintFilter', 'priceFilter', 'dateFilter'];
    filterInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', applyFilters);
    });

    document.getElementById('clearFilters').addEventListener('click', clearFilters);

    // Fetch animal prices and initialize select when page loads
    fetchAnimalPrices();
    
    fetchSales();
});
