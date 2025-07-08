import React, { useEffect, useState } from 'react';
import { fetchFromApi } from '../api';

export default function DocumentsLettersPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFromApi('documents')
      .then(data => setDocuments(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading documents...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Documents & Letters</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Uploaded</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 && (
              <tr><td colSpan="5" className="text-center">No documents found.</td></tr>
            )}
            {documents.map(doc => (
              <tr key={doc.id}>
                <td>{doc.title || doc.name}</td>
                <td>{doc.type || 'General'}</td>
                <td>{doc.uploadedAt || doc.createdAt || 'N/A'}</td>
                <td>{doc.status || 'Active'}</td>
                <td>
                  <a href={doc.url || '#'} className="btn btn-sm btn-primary" target="_blank" rel="noopener noreferrer">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 