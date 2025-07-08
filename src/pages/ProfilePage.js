import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user ? { ...user } : {});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user) return <div>Loading profile...</div>;

  const handleEdit = () => {
    setEditMode(true);
    setForm({ ...user });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setError('');
    setSuccess('');
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await updateUser(user.id, form);
      setSuccess('Profile updated!');
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">My Profile</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <img src={user.image} alt="avatar" className="rounded-circle mb-3" width={100} height={100} />
              <h4 className="fw-bold mb-1">{user.firstName} {user.lastName}</h4>
              <div className="text-muted mb-2">{user.email}</div>
              <div className="mb-2">{user.phone}</div>
              <div className="mb-2">{user.address?.address}, {user.address?.city}</div>
              {!editMode && (
                <button className="btn btn-primary mt-2" onClick={handleEdit}>Edit Profile</button>
              )}
            </div>
          </div>
          {editMode && (
            <div className="card shadow-sm mb-4">
              <div className="card-header fw-semibold">Edit Profile</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <input className="form-control" name="firstName" value={form.firstName || ''} onChange={handleChange} placeholder="First Name" />
                  </div>
                  <div className="mb-2">
                    <input className="form-control" name="lastName" value={form.lastName || ''} onChange={handleChange} placeholder="Last Name" />
                  </div>
                  <div className="mb-2">
                    <input className="form-control" name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" />
                  </div>
                  <div className="mb-2">
                    <input className="form-control" name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Phone" />
                  </div>
                  <div className="mb-2">
                    <input className="form-control" name="image" value={form.image || ''} onChange={handleChange} placeholder="Avatar URL" />
                  </div>
                  <div className="mb-2">
                    <input className="form-control" name="address" value={form.address?.address || ''} onChange={e => setForm(f => ({ ...f, address: { ...f.address, address: e.target.value } }))} placeholder="Address" />
                  </div>
                  <div className="mb-2">
                    <input className="form-control" name="city" value={form.address?.city || ''} onChange={e => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))} placeholder="City" />
                  </div>
                  {error && <div className="alert alert-danger py-1">{error}</div>}
                  {success && <div className="alert alert-success py-1">{success}</div>}
                  <button className="btn btn-success me-2" type="submit">Save</button>
                  <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancel</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 