import React from 'react';
import { useAuth } from '../components/AuthContext';

export default function ExpenseClaimsPage() {
  const { user, isAdmin, isHR, isEmployee } = useAuth();
  return (
    <div>
      <h2>Expense Claims</h2>
      <p>This is a static demo page for expense claims.</p>
      {(isHR || isEmployee) && (
        <button className="btn btn-primary mb-3">Submit Expense</button>
      )}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Employee</th>
            <th>Amount</th>
            <th>Status</th>
            {(isAdmin || isHR) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>EXP001</td>
            <td>Ravi Kumar</td>
            <td>$120</td>
            <td>Pending</td>
            {(isAdmin || isHR) && (
              <td>
                <button className="btn btn-success btn-sm me-2">Approve</button>
                <button className="btn btn-danger btn-sm">Reject</button>
              </td>
            )}
          </tr>
          <tr>
            <td>EXP002</td>
            <td>Priya Singh</td>
            <td>$80</td>
            <td>Approved</td>
            {(isAdmin || isHR) && <td></td>}
          </tr>
        </tbody>
      </table>
    </div>
  );
} 