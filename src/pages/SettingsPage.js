import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';

const ROLES = ['admin', 'hr', 'employee'];

export default function SettingsPage() {
  const { users, addUser, updateUser, deleteUser, changeUserRole, isAdmin, user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'employee', avatar: '' });
  const [error, setError] = useState('');

  if (!isAdmin) return <div className="alert alert-danger mt-4">Access Denied</div>;

  const handleAdd = () => {
    setForm({ username: '', password: '', name: '', role: 'employee', avatar: '' });
    setShowAdd(true);
    setEditUser(null);
    setError('');
  };

  const handleEdit = (u) => {
    setForm({ ...u });
    setEditUser(u.username);
    setShowAdd(true);
    setError('');
  };

  const handleDelete = (username) => {
    if (window.confirm('Delete user?')) deleteUser(username);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.name) {
      setError('All fields are required');
      return;
    }
    if (editUser) {
      updateUser(editUser, form);
    } else {
      if (users.some(u => u.username === form.username)) {
        setError('Username already exists');
        return;
      }
      addUser(form);
    }
    setShowAdd(false);
    setEditUser(null);
    setError('');
  };

  return (
    <div className="container">
      <h2 className="mb-3">Settings & User Roles</h2>
      <div className="mb-3">
        <button className="btn btn-success" onClick={handleAdd}>Add User</button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Role</th>
            <th>Avatar</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.username} className={u.username === user.username ? 'table-info' : ''}>
              <td>{u.username}</td>
              <td>{u.name}</td>
              <td>
                <select value={u.role} onChange={e => changeUserRole(u.username, e.target.value)} className="form-select form-select-sm" disabled={u.username === user.username}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </td>
              <td>{u.avatar ? <img src={u.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} /> : '-'}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(u)} disabled={u.username === user.username}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.username)} disabled={u.username === user.username}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAdd && (
        <div className="card p-3 mb-3">
          <h5>{editUser ? 'Edit User' : 'Add User'}</h5>
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-3">
              <input className="form-control" placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} disabled={!!editUser} />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} type="password" />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Avatar URL (optional)" value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} />
            </div>
            <div className="col-md-12">
              {error && <div className="alert alert-danger py-1">{error}</div>}
              <button className="btn btn-success me-2" type="submit">{editUser ? 'Update' : 'Add'}</button>
              <button className="btn btn-secondary" type="button" onClick={() => { setShowAdd(false); setEditUser(null); setError(''); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 