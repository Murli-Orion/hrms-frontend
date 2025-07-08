import React, { useEffect, useState } from 'react';
import { fetchFromApi } from '../../api';

export default function ReportsPage() {
  const [employeeStats, setEmployeeStats] = useState(null);
  const [orgStats, setOrgStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchFromApi('employees'),
      fetchFromApi('org')
    ])
      .then(([empData, orgData]) => {
        setEmployeeStats(empData.users ? empData.users.length : (empData.length || 0));
        setOrgStats(orgData.length || 0);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">HRMS Reports & Analytics</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-center shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Employees</h5>
              <div className="display-4 fw-bold">{employeeStats}</div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-center shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">Org Units</h5>
              <div className="display-4 fw-bold">{orgStats}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Add more analytics and tables as needed, using API data */}
      <div className="alert alert-info text-center">More analytics and export features can be added here using real API data.</div>
    </div>
  );
} 