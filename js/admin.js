// Admin dashboard functionality
async function loadAdminData() {
  try {
    // Load products
    const products = await apiRequest('/products');
    renderProductsTable(products);

    // Load orders
    const orders = await apiRequest('/orders');
    renderOrdersTable(orders);

    // Load users
    const users = await apiRequest('/users');
    renderUsersTable(users);
  } catch (error) {
    console.error('Error loading admin data:', error);
  }
}

function formatKes(value) {
  return `KES ${value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function renderProductsTable(products) {
  const tbody = document.getElementById('productsTable');
  tbody.innerHTML = products.map(product => `
    <tr>
      <td>${product.id}</td>
      <td><img src="${product.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"></td>
      <td>${product.name}</td>
      <td>${formatKes(product.price)}</td>
      <td>${product.category}</td>
      <td class="admin-actions">
        <button class="admin-btn btn-edit" onclick="editProduct(${product.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="admin-btn btn-danger" onclick="deleteProduct(${product.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('ordersTable');
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td>#${order.id}</td>
      <td>${formatKes(order.total)}</td>
      <td>${order.items.length} items</td>
      <td>${new Date(order.timestamp).toLocaleDateString()}</td>
    </tr>
  `).join('');
}

function renderUsersTable(users) {
  const tbody = document.getElementById('usersTable');
  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
    </tr>
  `).join('');
}

function setupAdminEvents() {
  // Tab navigation
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.target.getAttribute('href');
      document.querySelector('.nav-tab.active').classList.remove('active');
      e.target.classList.add('active');
      
      document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
      });
      document.getElementById(target.substring(1) + 'Tab').style.display = 'block';
    });
  });

  // Add product button
  document.getElementById('addProductBtn').addEventListener('click', () => {
    showProductModal(null);
  });

  // Modal events
  document.getElementById('closeModal').addEventListener('click', hideProductModal);
  document.getElementById('cancelBtn').addEventListener('click', hideProductModal);
  document.getElementById('productForm').addEventListener('submit', handleProductForm);

  // Close modal on outside click
  document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target.id === 'productModal') hideProductModal();
  });
}

async function editProduct(id) {
  const product = await apiRequest(`/products/${id}`);
  showProductModal(product);
}

async function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    await apiRequest(`/products/${id}`, { method: 'DELETE' });
    loadAdminData();
    showNotification('Product deleted successfully', 'success');
  }
}

function showProductModal(product = null) {
  const modal = document.getElementById('productModal');
  const title = document.getElementById('modalTitle');
  
  if (product) {
    title.textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOriginalPrice').value = product.originalPrice || '';
    document.getElementById('productDiscount').value = product.discount || '';
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description || '';
  } else {
    title.textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
  }
  
  modal.style.display = 'flex';
}

function hideProductModal() {
  document.getElementById('productModal').style.display = 'none';
}

async function handleProductForm(e) {
  e.preventDefault();
  const productId = document.getElementById('productId').value;
  const productData = {
    name: document.getElementById('productName').value,
    price: parseFloat(document.getElementById('productPrice').value),
    originalPrice: document.getElementById('productOriginalPrice').value ? 
                   parseFloat(document.getElementById('productOriginalPrice').value) : null,
    discount: document.getElementById('productDiscount').value ? 
              parseInt(document.getElementById('productDiscount').value) : 0,
    category: document.getElementById('productCategory').value,
    image: document.getElementById('productImage').value,
    description: document.getElementById('productDescription').value
  };

  try {
    if (productId) {
      await apiRequest(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
      showNotification('Product updated successfully', 'success');
    } else {
      await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      showNotification('Product added successfully', 'success');
    }
    hideProductModal();
    loadAdminData();
  } catch (error) {
    showNotification('Error saving product: ' + error.message, 'error');
  }
}