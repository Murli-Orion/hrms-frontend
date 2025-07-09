import React, { useEffect, useState } from 'react';
import { fetchFromApi } from '../api';

const ROLES = ['Super Admin', 'Admin', 'HR', 'Employee'];
const COMPANIES = [
  { id: 1, name: 'Acme Corp' },
  { id: 2, name: 'Globex Inc' },
  { id: 3, name: 'Umbrella Ltd' },
  { id: 4, name: 'Wayne Enterprises' },
];

export default function SuperAdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalRole, setModalRole] = useState('');
  const [modalCompany, setModalCompany] = useState('');
  const [modalStatus, setModalStatus] = useState('active');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, search, companyFilter]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFromApi('users');
      // Add mock company, role, status fields
      const usersWithMeta = (data.users || []).map((u, i) => ({
        ...u,
        company: COMPANIES[i % COMPANIES.length],
        role: i === 0 ? 'Super Admin' : (i % 4 === 1 ? 'Admin' : (i % 4 === 2 ? 'HR' : 'Employee')),
        status: i % 7 === 0 ? 'inactive' : 'active',
      }));
      setUsers(usersWithMeta);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;
    if (companyFilter !== 'all') {
      filtered = filtered.filter(u => u.company.id === Number(companyFilter));
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(u =>
        u.firstName.toLowerCase().includes(s) ||
        u.lastName.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s)
      );
    }
    setFilteredUsers(filtered);
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setModalRole(user.role);
    setModalCompany(user.company.id);
    setModalStatus(user.status);
    setShowModal(true);
  };

  const saveRoleChange = () => {
    setSaving(true);
    setTimeout(() => {
      setUsers(prev => prev.map(u =>
        u.id === selectedUser.id
          ? { ...u, role: modalRole, company: COMPANIES.find(c => c.id === Number(modalCompany)), status: modalStatus }
          : u
      ));
      setShowModal(false);
      setSaving(false);
    }, 1200);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Super Admin Dashboard</h2>
          <p className="text-muted mb-0">Manage all users, roles, and companies</p>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={companyFilter}
            onChange={e => setCompanyFilter(e.target.value)}
          >
            <option value="all">All Companies</option>
            {COMPANIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-4"><div className="spinner-border text-primary" /></td></tr>
            ) : error ? (
              <tr><td colSpan="6" className="text-danger text-center">{error}</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No users found.</td></tr>
            ) : filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img src={user.image} alt="avatar" className="rounded-circle" width={36} height={36} style={{ objectFit: 'cover' }} />
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="badge bg-secondary">{user.role}</span>
                </td>
                <td>{user.company.name}</td>
                <td>
                  <span className={`badge bg-${user.status === 'active' ? 'success' : 'danger'}`}>{user.status}</span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openRoleModal(user)}>
                    <i className="fas fa-user-cog me-1"></i> Change Role
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Assignment Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Role & Company</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select className="form-select" value={modalRole} onChange={e => setModalRole(e.target.value)}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Company</label>
                  <select className="form-select" value={modalCompany} onChange={e => setModalCompany(e.target.value)}>
                    {COMPANIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveRoleChange} disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-save me-2"></i>}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
} 