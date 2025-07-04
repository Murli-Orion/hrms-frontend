import React from 'react';
import { useAuth } from '../components/AuthContext';

export default function AccountsPage() {
  const { isAdmin, isHR, isEmployee } = useAuth();
  if (isEmployee) return <div className="alert alert-danger mt-4">Access Denied</div>;
  return (
    <div>
      <h2>Accounts</h2>
      {isAdmin && <p>Full access to accounts features (static demo).</p>}
      {isHR && <p>View/report access only (static demo).</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Account</th>
            <th>Balance</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Salary Disbursement</td>
            <td>$100,000</td>
            <td>Expense</td>
          </tr>
          <tr>
            <td>Reimbursements</td>
            <td>$5,000</td>
            <td>Expense</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
} 