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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      getCurrentUser()
        .then(u => setUser(u))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const data = await loginUser(username, password);
      const me = await getCurrentUser();
      setUser(me);
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
  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';
  const isEmployee = user?.role === 'employee';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isHR, isEmployee, addUser, updateUser, deleteUser, searchUsers, filterUsers, paginateUsers, sortUsers, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 