document.addEventListener('DOMContentLoaded', () => {
  updateAuthNav();
  updateCartCount();
  animateOnScroll();
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetSelector = this.getAttribute('href');
      if (targetSelector.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(targetSelector);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

function updateAuthNav() {
  const userIcon = document.querySelector('.user-icon');
  const user = getCurrentUser();
  if (!userIcon) return;

  if (user) {
    userIcon.innerHTML = `<span style="font-size:0.9rem; font-weight:700;">Hi, ${user.name}</span>`;
    userIcon.title = `Logged in as ${user.name}`;
  } else {
    userIcon.innerHTML = `<i class="fas fa-user"></i>`;
    userIcon.title = 'Login';
  }
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
}

async function updateCartCount() {
  try {
    const cartData = await apiRequest('/cart');
    const count = cartData.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cartIcon').forEach(icon => {
      const parent = icon.parentElement;
      if (!parent) return;
      let counter = parent.querySelector('.cart-count');
      if (count > 0) {
        if (!counter) {
          counter = document.createElement('div');
          counter.className = 'cart-count';
          parent.appendChild(counter);
        }
        counter.textContent = count;
      } else if (counter) {
        counter.remove();
      }
    });
  } catch (error) {
    console.error('Unable to update cart count', error);
  }
}

function animateOnScroll() {
  document.querySelectorAll('.fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
}

function showNotification(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    color: white;
    background: ${type === 'success' ? 'var(--primary)' : '#ef4444'};
    box-shadow: 0 16px 40px rgba(0,0,0,0.25);
    z-index: 10000;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 250ms ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 2500);
}
