
    const express = require('express');
    const path = require('path');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const fs = require('fs');

    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));

    // Load initial products from JSON string
    let products = 
[
  {
    "id": "1",
    "name": "Wireless Mouse",
    "category": "Electronics",
    "price": 799,
    "image": "https://via.placeholder.com/200?text=Mouse",
    "description": "Ergonomic wireless mouse with 2.4 GHz connectivity.",
    "reviews": []
  },
  {
    "id": "2",
    "name": "Bluetooth Headphones",
    "category": "Electronics",
    "price": 2999,
    "image": "https://via.placeholder.com/200?text=Headphones",
    "description": "Over‑ear Bluetooth headphones with noise isolation.",
    "reviews": []
  },
  {
    "id": "3",
    "name": "Coffee Mug",
    "category": "Home & Kitchen",
    "price": 399,
    "image": "https://via.placeholder.com/200?text=Mug",
    "description": "Ceramic mug, 350 ml, dishwasher‑safe.",
    "reviews": []
  },
  {
    "id": "4",
    "name": "Yoga Mat",
    "category": "Fitness",
    "price": 1299,
    "image": "https://via.placeholder.com/200?text=Yoga+Mat",
    "description": "Non‑slip yoga mat with carrying strap.",
    "reviews": []
  },
  {
    "id": "5",
    "name": "Classic Novel",
    "category": "Books",
    "price": 249,
    "image": "https://via.placeholder.com/200?text=Book",
    "description": "A timeless literary masterpiece in paperback.",
    "reviews": []
  },
  {
    "id": "6",
    "name": "Running Shoes",
    "category": "Footwear",
    "price": 4799,
    "image": "https://via.placeholder.com/200?text=Shoes",
    "description": "Lightweight running shoes for daily training.",
    "reviews": []
  },
  {
    "id": "7",
    "name": "Desk Lamp",
    "category": "Home & Kitchen",
    "price": 1099,
    "image": "https://via.placeholder.com/200?text=Lamp",
    "description": "LED desk lamp with adjustable brightness.",
    "reviews": []
  },
  {
    "id": "8",
    "name": "Graphic T‑Shirt",
    "category": "Clothing",
    "price": 699,
    "image": "https://via.placeholder.com/200?text=T-Shirt",
    "description": "100% cotton T‑shirt with trendy print.",
    "reviews": []
  }
]
;

    // === Helper Functions ===
    const filterProducts = (query) => {
        let result = [...products];
        const search = (query.search || '').toLowerCase();
        const category = query.category || '';
        const minPrice = Number(query.minPrice) || 0;
        const maxPrice = Number(query.maxPrice) || Number.MAX_SAFE_INTEGER;

        if (search) {
            result = result.filter(p => p.name.toLowerCase().includes(search));
        }
        if (category) {
            result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);
        return result;
    };

    // === Routes ===

    // GET /api/products?search=&category=&minPrice=&maxPrice=
    app.get('/api/products', (req, res) => {
        const filtered = filterProducts(req.query);
        res.json(filtered);
    });

    // GET /api/products/:id
    app.get('/api/products/:id', (req, res) => {
        const product = products.find(p => p.id === req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    });

    // GET /api/products/:id/reviews
    app.get('/api/products/:id/reviews', (req, res) => {
        const product = products.find(p => p.id === req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product.reviews || []);
    });

    // POST /api/products/:id/reviews
    app.post('/api/products/:id/reviews', (req, res) => {
        const product = products.find(p => p.id === req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        const { name, rating, comment } = req.body;
        if (!name || !rating || !comment) {
            return res.status(400).json({ error: 'Name, rating, and comment are required' });
        }
        const newReview = {
            id: Date.now().toString(36),
            name,
            rating: Number(rating),
            comment,
            createdAt: new Date()
        };
        product.reviews.push(newReview);
        res.status(201).json(newReview);
    });

    // Fallback to single-page app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.listen(PORT, () => {
        console.log(`E-commerce platform running at http://localhost:${PORT}`);
    });
