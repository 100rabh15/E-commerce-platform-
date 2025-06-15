
const productDetail = document.getElementById('product-detail');
const reviewsList = document.getElementById('reviews-list');
const reviewForm = document.getElementById('review-form');
const reviewerName = document.getElementById('reviewer-name');
const reviewRating = document.getElementById('review-rating');
const reviewComment = document.getElementById('review-comment');

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const fetchProduct = async () => {
    const res = await fetch('/api/products/' + productId);
    if (!res.ok) {
        productDetail.innerHTML = '<p>Product not found.</p>';
        return;
    }
    const product = await res.json();
    renderProduct(product);
};

const renderProduct = (p) => {
    productDetail.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <div class="product-info">
            <h2>${p.name}</h2>
            <p>${p.description}</p>
            <p class="price">Price: ₹${p.price}</p>
            <p>Category: ${p.category}</p>
        </div>
    `;
};

const fetchReviews = async () => {
    const res = await fetch('/api/products/' + productId + '/reviews');
    const reviews = await res.json();
    renderReviews(reviews);
};

const renderReviews = (reviews) => {
    reviewsList.innerHTML = '';
    if (reviews.length === 0) {
        reviewsList.textContent = 'No reviews yet.';
        return;
    }
    reviews.forEach(r => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${r.name}</strong> (${r.rating}★) – ${r.comment}`;
        reviewsList.appendChild(li);
    });
};

reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const review = {
        name: reviewerName.value.trim(),
        rating: reviewRating.value,
        comment: reviewComment.value.trim()
    };
    const res = await fetch('/api/products/' + productId + '/reviews', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review)
    });
    if (res.ok) {
        reviewerName.value = '';
        reviewRating.value = '';
        reviewComment.value = '';
        fetchReviews(); // reload reviews
    } else {
        alert('Failed to add review');
    }
});

// Initial load
fetchProduct();
fetchReviews();
