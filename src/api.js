// Generic API service for HRMS modules using online free APIs
// You can add more base URLs for different modules as needed

const API_BASES = {
  employees: 'https://dummyjson.com/users',
  attendance: 'https://dummyjson.com/users', // Stand-in for attendance
  performance: 'https://dummyjson.com/posts', // Stand-in for performance
  org: 'https://dummyjson.com/users', // Stand-in for org units
  documents: 'https://dummyjson.com/posts', // Stand-in for documents
  notifications: 'https://dummyjson.com/comments', // Stand-in for notifications
  // Add more as needed
};

export async function fetchFromApi(module, endpoint = '', options = {}) {
  const base = API_BASES[module];
  if (!base) throw new Error(`Unknown API module: ${module}`);
  const url = endpoint ? `${base}/${endpoint}` : base;
  const token = localStorage.getItem('authToken');
  const headers = { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function loginUser(username, password) {
  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  if (data.accessToken) localStorage.setItem('authToken', data.accessToken);
  if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
  return data;
}

export async function getCurrentUser() {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No auth token');
  const res = await fetch('https://dummyjson.com/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function refreshAuthSession() {
  const refreshToken = localStorage.getItem('refreshToken');
  const res = await fetch('https://dummyjson.com/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to refresh session');
  const data = await res.json();
  if (data.accessToken) localStorage.setItem('authToken', data.accessToken);
  if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
  return data;
}

export async function addUser(user) {
  const token = localStorage.getItem('authToken');
  const res = await fetch('https://dummyjson.com/users/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Failed to add user');
  return res.json();
}

export async function updateUser(id, user) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`https://dummyjson.com/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`https://dummyjson.com/users/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}

export async function searchUsers(query) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (!res.ok) throw new Error('Failed to search users');
  return res.json();
}

export async function filterUsers(key, value) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`https://dummyjson.com/users/filter?key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (!res.ok) throw new Error('Failed to filter users');
  return res.json();
}

export async function paginateUsers(limit, skip, select) {
  const token = localStorage.getItem('authToken');
  let url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
  if (select) url += `&select=${select}`;
  const res = await fetch(url, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (!res.ok) throw new Error('Failed to paginate users');
  return res.json();
}

export async function sortUsers(sortBy, order) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`https://dummyjson.com/users?sortBy=${encodeURIComponent(sortBy)}&order=${encodeURIComponent(order)}`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (!res.ok) throw new Error('Failed to sort users');
  return res.json();
}

// Example usage:
// const users = await fetchFromApi('employees');
// const orgUnits = await fetchFromApi('org'); 