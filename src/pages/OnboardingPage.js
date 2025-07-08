import React, { useEffect, useState } from 'react';
import { fetchFromApi } from '../api';

export default function OnboardingPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', onboardingStatus: 'Pending' });
  const [addError, setAddError] = useState(null);

  useEffect(() => {
    fetchFromApi('employees')
      .then(data => setEmployees(data.users || data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      setAddError('All fields are required');
      return;
    }
    // Simulate API POST (would use fetch with POST in real app)
    setEmployees(prev => [
      { id: Date.now(), ...form },
      ...prev
    ]);
    setShowAdd(false);
    setForm({ firstName: '', lastName: '', email: '', onboardingStatus: 'Pending' });
    setAddError(null);
  };

  if (loading) return <div>Loading onboarding data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Employee Onboarding</h2>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <i className="fa fa-user-plus me-2"></i>Add Employee
        </button>
      </div>
      {showAdd && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add New Employee</h5>
            <form onSubmit={handleAdd} className="row g-3">
              <div className="col-md-4">
                <input type="text" className="form-control" placeholder="First Name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
              </div>
              <div className="col-md-4">
                <input type="text" className="form-control" placeholder="Last Name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
              </div>
              <div className="col-md-4">
                <input type="email" className="form-control" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="col-md-4">
                <select className="form-select" value={form.onboardingStatus} onChange={e => setForm(f => ({ ...f, onboardingStatus: e.target.value }))}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success">Add</button>
                <button type="button" className="btn btn-link ms-2" onClick={() => setShowAdd(false)}>Cancel</button>
                {addError && <span className="text-danger ms-3">{addError}</span>}
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr><td colSpan="3" className="text-center">No employees found.</td></tr>
            )}
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.firstName} {emp.lastName}</td>
                <td>{emp.email}</td>
                <td>
                  <span className={`badge bg-${emp.onboardingStatus === 'Completed' ? 'success' : emp.onboardingStatus === 'In Progress' ? 'warning' : 'secondary'}`}>
                    {emp.onboardingStatus || 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 