// Products rendering and filtering
function formatKes(value) {
  return `KES ${value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

async function loadProducts(category = null, search = null) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (search) params.set('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const products = await apiRequest(`/products${query}`);

    const container = document.getElementById('productsGrid') || document.getElementById('featuredProducts');
    if (!container) return;

    const items = products.map(createProductCard).join('');
    container.innerHTML = items;
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function createProductCard(product) {
  const discount = product.discount || 0;
  const originalPrice = product.originalPrice || (product.price * 1.3).toFixed(2);

  return `
    <div class="card product-card">
      ${discount > 0 ? `<div class="discount-badge">${discount}% OFF</div>` : ''}
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <h4 class="product-title">${product.name}</h4>
        <div class="price">
          ${formatKes(product.price)}
          ${discount > 0 ? `<span class="original-price">${formatKes(parseFloat(originalPrice))}</span>` : ''}
        </div>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
          ${product.description || 'Premium quality fashion.'}
        </p>
        <button class="btn btn-primary w-full" onclick="addToCart(${product.id})">
          <i class="fas fa-shopping-bag"></i>
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

function setupFilters() {
  // Filter setup is handled inline in products.html.
}
