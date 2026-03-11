// ===== DarshanEase Global App.js =====

// Get current logged-in user from localStorage
function getCurrentUser() {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// Get JWT token
function getToken() {
  return localStorage.getItem('token') || null;
}

// Update Navbar based on auth state
function updateNavbar() {
  const user = getCurrentUser();
  const token = getToken();

  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const userGreeting = document.getElementById('userGreeting');
  const logoutBtn = document.getElementById('logoutBtn');

  if (user && token) {
    if (loginBtn) loginBtn.classList.add('hidden');
    if (registerBtn) registerBtn.classList.add('hidden');
    if (userGreeting) {
      userGreeting.textContent = `🙏 ${user.name.split(' ')[0]}`;
      userGreeting.classList.remove('hidden');
    }
    if (logoutBtn) {
      logoutBtn.classList.remove('hidden');
      logoutBtn.addEventListener('click', doLogout);
    }
  } else {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (registerBtn) registerBtn.classList.remove('hidden');
    if (userGreeting) userGreeting.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
  }
}

function doLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('lastBooking');
  showToast('Logged out successfully', 'success');
  setTimeout(() => window.location = 'login.html', 600);
}

// ===== Toast Notifications =====
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icon = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }[type] || 'ℹ️';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== API Helper =====
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(endpoint, { ...options, headers: { ...headers, ...options.headers } });
  const data = await res.json();
  return data;
}

// ===== Format helpers =====
function formatDate(dateStr) {
  if (!dateStr) return '–';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatCurrency(amount) {
  return '₹' + (amount || 0).toLocaleString('en-IN');
}

function formatDateTime(dateStr) {
  if (!dateStr) return '–';
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function truncate(str, len = 80) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

// ===== Star Rating =====
function renderStars(rating) {
  return [1, 2, 3, 4, 5]
    .map(i => `<i class="fas fa-star star ${i <= Math.floor(rating) ? '' : 'empty'}"></i>`)
    .join('');
}

// ===== Status badge =====
function statusBadge(status) {
  const map = {
    confirmed: 'badge-success',
    cancelled:  'badge-danger',
    completed:  'badge-info',
    pending:    'badge-warning'
  };
  return `<span class="badge ${map[status] || 'badge-info'}">${status}</span>`;
}

// ===== Modal helpers =====
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

// Close on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('show');
  }
});

// ===== Debounce =====
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// ===== Run on every page load =====
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
});
