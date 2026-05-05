// Products functionality
async function loadProducts(category = null, search = null) {
  try {
    const url = new URLSearchParams({
      ...(category && { category }),
      ...(search && { search })
    }).toString();
    
    const response = await apiRequest(`/products?${url}`);
    const container = document.getElementById('productsGrid') || document.getElementById('featuredProducts');
    container.innerHTML = response.map(product => createProductCard(product)).join('');
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
          KES ${product.price.toFixed(2)}
          ${discount > 0 ? `<span class="original-price">KES ${originalPrice}</span>` : ''}
        </div>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
          ${product.description || 'Premium quality fashion'}
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
  // Filter functionality already handled in products.html
  console.log('Filters ready');
}