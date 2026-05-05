let cart = [];

function formatKes(value) {
  return `KES ${value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

async function loadCart() {
  try {
    cart = await apiRequest('/cart');
    renderCart();
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartItemCountEl = document.getElementById('cartItemCount');
  const cartTotalEl = document.getElementById('cartTotal');

  if (!cartItemsEl || !cartItemCountEl || !cartTotalEl) return;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
          <i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p>Your cart is empty</p>
          <a href="index.html" class="btn btn-primary">Start Shopping</a>
        </td>
      </tr>
    `;
    cartItemCountEl.textContent = '0';
    cartTotalEl.textContent = formatKes(0);
    return;
  }

  Promise.all(cart.map(item => apiRequest(`/products/${item.productId}`))).then(products => {
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
          <td style="color: var(--accent); font-weight: 600;">${formatKes(product.price)}</td>
          <td>
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="updateQuantity(${product.id}, -1)">−</button>
              <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
            </div>
          </td>
          <td style="color: var(--accent); font-weight: 700;">${formatKes(itemTotal)}</td>
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
    cartTotalEl.textContent = formatKes(totalPrice);
  });
}

async function addToCart(productId, quantity = 1) {
  try {
    await apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
    await updateCartCount();
    showNotification('Added to cart!', 'success');
  } catch (error) {
    showNotification('Error adding to cart', 'error');
  }
}

async function updateQuantity(productId, change) {
  const item = cart.find(item => item.productId === productId);
  if (!item) return;

  const quantity = Math.max(1, item.quantity + change);
  try {
    await apiRequest(`/cart/update/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
    await loadCart();
    await updateCartCount();
  } catch (error) {
    console.error('Error updating cart quantity:', error);
  }
}

async function removeFromCart(productId) {
  if (!confirm('Remove this item from cart?')) return;
  try {
    await apiRequest(`/cart/${productId}`, { method: 'DELETE' });
    await loadCart();
    await updateCartCount();
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
}
