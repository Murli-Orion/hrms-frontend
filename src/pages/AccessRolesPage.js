import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';

const ROLES = ['admin', 'hr', 'employee'];

export default function AccessRolesPage() {
  const { isAdmin, isHR, updateUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then(res => res.json())
      .then(data => setUsers(data.users || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUser(id, { role: newRole });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading user roles...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Standard Access Roles Management</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan="4" className="text-center">No users found.</td></tr>
            )}
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td><span className="badge bg-primary">{user.role || 'employee'}</span></td>
                <td>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={user.role || 'employee'}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    disabled={!(isAdmin || isHR)}
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 