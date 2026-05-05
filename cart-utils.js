// Cart management
let cart = [];

async function loadCart() {
  try {
    const response = await apiRequest('/cart');
    cart = response;
    renderCart();
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartItemCountEl = document.getElementById('cartItemCount');
  const cartTotalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
          <i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p>Your cart is empty</p>
          <a href="products.html" class="btn btn-primary">Start Shopping</a>
        </td>
      </tr>
    `;
    cartItemCountEl.textContent = '0';
    cartTotalEl.textContent = 'KES 0.00';
    return;
  }

  // Load products for cart items
  Promise.all(cart.map(item => 
    apiRequest(`/products/${item.productId}`)
  )).then(products => {
    let totalItems = 0;
    let totalPrice = 0;

    const rows = products.map((product, index) => {
      const item = cart[index];
      const itemTotal = product.price * item.quantity;
      totalItems += item.quantity;
      totalPrice += itemTotal;

      return `
        <tr>
          <td style="display: flex; align-items: center; gap: 1rem;">
            <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div>
              <div style="font-weight: 600;">${product.name}</div>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">${product.category}</div>
            </div>
          </td>
          <td style="color: var(--accent); font-weight: 600;">$${product.price.toFixed(2)}</td>
          <td>
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="updateQuantity(${product.id}, -1)">−</button>
              <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
            </div>
          </td>
          <td style="color: var(--accent); font-weight: 700;">$${itemTotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${product.id})" style="padding: 0.5rem;">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    cartItemsEl.innerHTML = rows;
    cartItemCountEl.textContent = totalItems;
    cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
  });
}

async function addToCart(productId, quantity = 1) {
  try {
    await apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
    updateCartCount();
    showNotification('Added to cart!', 'success');
  } catch (error) {
    showNotification('Error adding to cart', 'error');
  }
}

async function updateQuantity(productId, change) {
  const item = cart.find(item => item.productId === productId);
  if (item) {
    const newQuantity = Math.max(1, item.quantity + change);
    await apiRequest(`/cart/update/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: newQuantity })
    });
    await loadCart();
    updateCartCount();
  }
}

async function removeFromCart(productId) {
  if (confirm('Remove this item from cart?')) {
    await apiRequest(`/cart/${productId}`, { method: 'DELETE' });
    await loadCart();
    updateCartCount();
  }
}

function updateCartCount() {
  apiRequest('/cart').then(cartData => {
    const count = cartData.reduce((sum, item) => sum + item.quantity, 0);
    const cartIcons = document.querySelectorAll('#cartIcon');
    cartIcons.forEach(icon => {
      const countEl = icon.parentElement.querySelector('.cart-count');
      if (count > 0) {
        if (!countEl) {
          const newCount = document.createElement('div');
          newCount.className = 'cart-count';
          newCount.textContent = count;
          icon.parentElement.appendChild(newCount);
        } else {
          countEl.textContent = count;
        }
      } else {
        const existingCount = icon.parentElement.querySelector('.cart-count');
        if (existingCount) existingCount.remove();
      }
    });
  });
}

function showNotification(message, type = 'success') {
  // Simple toast notification
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 2rem;
    border-radius: var(--radius);
    color: white;
    font-weight: 600;
    z-index: 10000;
    transform: translateX(400px);
    transition: var(--transition);
    background: ${type === 'success' ? 'var(--primary)' : '#ef4444'};
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}