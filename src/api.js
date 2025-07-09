// Static/mock API service for HRMS modules

// --- Static Data ---
const STATIC_USERS = [
  { id: 1, username: 'kminchelle', password: '0lelplR', firstName: 'Super', lastName: 'Admin', email: 'super@admin.com', role: 'Super Admin', company: { id: 1, name: 'Acme Corp' }, image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, username: 'johnd', password: 'm38rmF$', firstName: 'John', lastName: 'Doe', email: 'admin@company.com', role: 'Admin', company: { id: 2, name: 'Globex Inc' }, image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: 3, username: 'atuny0', password: '9uQFF1', firstName: 'HR', lastName: 'User', email: 'hr@company.com', role: 'HR', company: { id: 2, name: 'Globex Inc' }, image: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, username: 'mor_2314', password: '83r5^_', firstName: 'Employee', lastName: 'User', email: 'employee@company.com', role: 'Employee', company: { id: 2, name: 'Globex Inc' }, image: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { id: 5, username: 'emilys', password: 'emilyspass', firstName: 'Emily', lastName: 'Smith', email: 'emily@company.com', role: 'Employee', company: { id: 3, name: 'Umbrella Ltd' }, image: 'https://randomuser.me/api/portraits/women/5.jpg' },
];

const STATIC_ATTENDANCE = [
  { id: 1, userId: 4, date: '2024-06-01', status: 'Present', arrival: '09:05', departure: '18:00' },
  { id: 2, userId: 4, date: '2024-06-02', status: 'Absent', arrival: '', departure: '' },
  { id: 3, userId: 4, date: '2024-06-03', status: 'Present', arrival: '09:10', departure: '18:05' },
];

const STATIC_NOTIFICATIONS = [
  { id: 1, title: 'Welcome', message: 'Welcome to HRMS!', read: false, date: '2024-06-01' },
  { id: 2, title: 'Policy Update', message: 'Leave policy updated.', read: true, date: '2024-06-02' },
];

const STATIC_REPORTS = {
  employees: STATIC_USERS.length,
  orgUnits: 3,
  attendance: 92,
  departments: 4,
};

const STATIC_PERFORMANCE = [
  { id: 1, userId: 4, month: '2024-05', score: 85 },
  { id: 2, userId: 4, month: '2024-06', score: 90 },
];

// --- API Functions ---
export async function fetchFromApi(module, endpoint = '', options = {}) {
  switch (module) {
    case 'employees':
    case 'org':
      return { users: STATIC_USERS };
    case 'attendance':
      return STATIC_ATTENDANCE;
    case 'notifications':
      return STATIC_NOTIFICATIONS;
    case 'performance':
      return STATIC_PERFORMANCE;
    case 'reports':
      return STATIC_REPORTS;
    default:
      throw new Error(`Unknown API module: ${module}`);
  }
}

export async function loginUser(username, password) {
  const user = STATIC_USERS.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Invalid credentials');
  localStorage.setItem('authToken', 'static-token-' + user.id);
  return { id: user.id, username: user.username, accessToken: 'static-token-' + user.id };
}

export async function getCurrentUser() {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No auth token');
  const id = parseInt(token.replace('static-token-', ''), 10);
  const user = STATIC_USERS.find(u => u.id === id);
  if (!user) throw new Error('User not found');
  return user;
}

export async function refreshAuthSession() {
  // No-op for static demo
  return { accessToken: localStorage.getItem('authToken') };
}

export async function addUser(user) {
  // No-op for static demo
  return { ...user, id: Date.now() };
}

export async function updateUser(id, updatedFields) {
  // No-op for static demo
  return { id, ...updatedFields };
}

export async function deleteUser(id) {
  // No-op for static demo
  return { id };
}

export async function searchUsers(query) {
  return { users: STATIC_USERS.filter(u => u.username.includes(query) || u.firstName.includes(query) || u.lastName.includes(query)) };
}

export async function filterUsers(key, value) {
  return { users: STATIC_USERS.filter(u => u[key] === value) };
}

export async function paginateUsers(limit, skip, select) {
  let users = STATIC_USERS.slice(skip, skip + limit);
  if (select) {
    const fields = select.split(',');
    users = users.map(u => {
      const obj = {};
      fields.forEach(f => obj[f] = u[f]);
      return obj;
    });
  }
  return { users };
}

export async function sortUsers(sortBy, order) {
  const users = [...STATIC_USERS].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return order === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return { users };
}

// Example usage:
// const users = await fetchFromApi('employees');
// const orgUnits = await fetchFromApi('org'); 