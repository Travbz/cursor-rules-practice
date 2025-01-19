let currentSort = { field: 'id', ascending: true };
let salesData = [];

async function fetchSales() {
    try {
        const response = await fetch('http://localhost:5001/api/sales');
        const data = await response.json();
        salesData = data.sales;
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
    const totalSales = salesData.reduce((sum, sale) => sum + sale.price, 0);
    document.getElementById('totalSales').textContent = formatPrice(totalSales).slice(1);
    document.getElementById('totalTransactions').textContent = salesData.length;
}

function sortData(field) {
    if (currentSort.field === field) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.field = field;
        currentSort.ascending = true;
    }

    salesData.sort((a, b) => {
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

    salesData.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.customer_name}</td>
            <td>${sale.animal}</td>
            <td>${formatPrice(sale.price)}</td>
            <td>${formatDate(sale.sale_date)}</td>
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generateSale').addEventListener('click', generateSale);
    
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            sortData(th.dataset.sort);
        });
    });

    fetchSales();
});
