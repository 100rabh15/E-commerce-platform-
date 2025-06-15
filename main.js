
const productList = document.getElementById('product-list');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');

const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (searchInput.value) params.append('search', searchInput.value.trim());
    if (categorySelect.value) params.append('category', categorySelect.value);
    if (minPrice.value) params.append('minPrice', minPrice.value);
    if (maxPrice.value) params.append('maxPrice', maxPrice.value);

    const res = await fetch('/api/products?' + params.toString());
    const products = await res.json();
    renderProducts(products);
};

const renderProducts = (products) => {
    productList.innerHTML = '';
    if (products.length === 0) {
        productList.innerHTML = '<p>No products found.</p>';
        return;
    }
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" />
            <h3>${p.name}</h3>
            <p class="price">₹${p.price}</p>
            <button onclick="window.location='product.html?id=${p.id}'">View</button>
        `;
        productList.appendChild(card);
    });
};

searchBtn.addEventListener('click', fetchProducts);
// Initial load
fetchProducts();
