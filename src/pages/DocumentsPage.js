import React from 'react';
import { useAuth } from '../components/AuthContext';

export default function DocumentsPage() {
  const { user, isEmployee } = useAuth();
  return (
    <div>
      <h2>Documents</h2>
      <p>Access your documents here (static demo).</p>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Document</th>
            <th>Owner</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Payslip_May2024.pdf</td>
            <td>{isEmployee ? user.name : 'Ravi Kumar'}</td>
            <td>Available</td>
          </tr>
          <tr>
            <td>OfferLetter.pdf</td>
            <td>{isEmployee ? user.name : 'Priya Singh'}</td>
            <td>Available</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
} 