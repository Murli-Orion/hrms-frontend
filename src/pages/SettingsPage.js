import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';

const ROLES = ['admin', 'hr', 'employee'];

export default function SettingsPage() {
  const { user, isAdmin, addUser, updateUser, deleteUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', firstName: '', lastName: '', email: '', role: 'employee', image: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then(res => res.json())
      .then(data => setUsers(data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  if (!isAdmin) return <div className="alert alert-danger mt-4">Access Denied</div>;

  const handleAdd = () => {
    setForm({ username: '', password: '', firstName: '', lastName: '', email: '', role: 'employee', image: '' });
    setShowAdd(true);
    setEditUser(null);
    setError('');
  };

  const handleEdit = (u) => {
    setForm({ ...u });
    setEditUser(u.id);
    setShowAdd(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete user?')) {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.firstName || !form.lastName || !form.email) {
      setError('All fields are required');
      return;
    }
    try {
      if (editUser) {
        await updateUser(editUser, form);
        setUsers(users.map(u => u.id === editUser ? { ...u, ...form } : u));
      } else {
        const newUser = await addUser(form);
        setUsers([newUser, ...users]);
      }
      setShowAdd(false);
      setEditUser(null);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Settings & User Roles</h2>
      <div className="mb-3">
        <button className="btn btn-success" onClick={handleAdd}>Add User</button>
      </div>
      {loading ? <div>Loading users...</div> : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Avatar</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className={u.id === user.id ? 'table-info' : ''}>
                <td>{u.username}</td>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role || 'employee'} onChange={e => handleEdit({ ...u, role: e.target.value })} className="form-select form-select-sm" disabled={u.id === user.id}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td>{u.image ? <img src={u.image} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} /> : '-'}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(u)} disabled={u.id === user.id}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)} disabled={u.id === user.id}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
              <input className="form-control" placeholder="First Name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Last Name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Avatar URL (optional)" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
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