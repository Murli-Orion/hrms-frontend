import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_USERS = [
  { username: 'admin', password: 'admin123', name: 'Amit Sharma', role: 'admin', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { username: 'hr', password: 'hr123', name: 'Priya Singh', role: 'hr', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { username: 'employee', password: 'emp123', name: 'Ravi Kumar', role: 'employee', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
];

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('hrmsUsers');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('authUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('hrmsUsers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem('authUser', JSON.stringify(user));
    else localStorage.removeItem('authUser');
  }, [user]);

  const login = (username, password) => {
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => setUser(null);

  const addUser = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (username, updatedFields) => {
    setUsers(prev => prev.map(u => u.username === username ? { ...u, ...updatedFields } : u));
    if (user && user.username === username) setUser(u => ({ ...u, ...updatedFields }));
  };

  const deleteUser = (username) => {
    setUsers(prev => prev.filter(u => u.username !== username));
    if (user && user.username === username) logout();
  };

  const changeUserRole = (username, newRole) => {
    updateUser(username, { role: newRole });
  };

  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';
  const isEmployee = user?.role === 'employee';

  return (
    <AuthContext.Provider value={{ user, users, login, logout, isAdmin, isHR, isEmployee, addUser, updateUser, deleteUser, changeUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 