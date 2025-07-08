import React, { useEffect, useState } from 'react';
import { fetchFromApi } from '../api';

export default function OrgStructurePage() {
  const [orgUnits, setOrgUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFromApi('org')
      .then(data => setOrgUnits(data.users))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading organization structure...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Organization Structure</h2>
      <div className="row g-4">
        {orgUnits.length === 0 && <div className="text-center">No org units found.</div>}
        {orgUnits.map(unit => (
          <div className="col-md-4" key={unit.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{unit.name}</h5>
                <p className="card-text">{unit.description || 'No description'}</p>
                <div><b>Manager:</b> {unit.manager || 'N/A'}</div>
                <div><b>Employees:</b> {unit.employeeCount || 0}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 