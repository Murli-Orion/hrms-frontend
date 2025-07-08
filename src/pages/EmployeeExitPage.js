import React, { useEffect, useState } from 'react';
import { fetchFromApi } from '../api';

export default function EmployeeExitPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exitStatus, setExitStatus] = useState({}); // {id: {exited: bool, date: string}}

  useEffect(() => {
    fetchFromApi('employees')
      .then(data => setEmployees(data.users || data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleExit = (id) => {
    setExitStatus(prev => ({
      ...prev,
      [id]: { exited: true, date: new Date().toISOString().split('T')[0] }
    }));
  };

  if (loading) return <div>Loading employee exit data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Employee Exit Management</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Exit Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr><td colSpan="5" className="text-center">No employees found.</td></tr>
            )}
            {employees.map(emp => {
              const exit = exitStatus[emp.id];
              return (
                <tr key={emp.id}>
                  <td>{emp.firstName} {emp.lastName}</td>
                  <td>{emp.email}</td>
                  <td>
                    <span className={`badge bg-${exit?.exited ? 'danger' : 'success'}`}>
                      {exit?.exited ? 'Exited' : 'Active'}
                    </span>
                  </td>
                  <td>{exit?.exited ? exit.date : '--'}</td>
                  <td>
                    {!exit?.exited && (
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleExit(emp.id)}>
                        Mark as Exited
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 