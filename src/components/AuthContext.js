import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser,
  getCurrentUser,
  addUser as apiAddUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  searchUsers,
  filterUsers,
  paginateUsers,
  sortUsers
} from '../api';

const AuthContext = createContext();

const MOCK_COMPANIES = [
  { id: 1, name: 'Acme Corp' },
  { id: 2, name: 'Globex Inc' },
  { id: 3, name: 'Umbrella Ltd' },
  { id: 4, name: 'Wayne Enterprises' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      getCurrentUser()
        .then(u => setUser(enrichUser(u)))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Helper to enrich user with role/company if missing
  const enrichUser = (u) => {
    if (!u) return null;
    // Assign mock role/company if not present
    let role = u.role;
    let company = u.company;
    if (!role) {
      // Super Admin for first user, then Admin, HR, Employee
      if (u.id === 1) role = 'Super Admin';
      else if (u.id % 4 === 2) role = 'Admin';
      else if (u.id % 4 === 3) role = 'HR';
      else role = 'Employee';
    }
    if (!company) {
      company = MOCK_COMPANIES[(u.id || 0) % MOCK_COMPANIES.length];
    }
    return { ...u, role, company };
  };

  const login = async (username, password) => {
    try {
      const data = await loginUser(username, password);
      const me = await getCurrentUser();
      setUser(enrichUser(me));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // User CRUD wrappers
  const addUser = async (newUser) => apiAddUser(newUser);
  const updateUser = async (id, updatedFields) => apiUpdateUser(id, updatedFields);
  const deleteUser = async (id) => apiDeleteUser(id);

  // Role helpers
  const isSuperAdmin = user?.role === 'Super Admin';
  const isAdmin = user?.role === 'Admin';
  const isHR = user?.role === 'HR';
  const isEmployee = user?.role === 'Employee';

  return (
    <AuthContext.Provider value={{ user, login, logout, isSuperAdmin, isAdmin, isHR, isEmployee, addUser, updateUser, deleteUser, searchUsers, filterUsers, paginateUsers, sortUsers, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 