// Authentication functions
async function signupUser(name, email, password) {
  const response = await apiRequest('/users/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
  return response;
}

async function loginUser(email, password) {
  const response = await apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  // Store user session
  localStorage.setItem('user', JSON.stringify(response.user));
  localStorage.setItem('token', response.token);
  return response;
}

// Check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('user');
}

// Get current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user') || 'null');
}

// Logout
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

// Update nav based on auth state
function updateAuthNav() {
  const userIcon = document.querySelector('.user-icon');
  if (userIcon) {
    const user = getCurrentUser();
    if (user) {
      userIcon.innerHTML = `<i class="fas fa-user-check"></i>`;
      userIcon.title = `Hi, ${user.name}`;
    } else {
      userIcon.innerHTML = `<i class="fas fa-user"></i>`;
    }
  }
}