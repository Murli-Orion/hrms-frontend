import React from 'react';
import { useAuth } from '../components/AuthContext';

export default function ProfilePage() {
  const { user, isAdmin, isHR, isEmployee } = useAuth();
  return (
    <div>
      <h2>Profile Management</h2>
      {isEmployee ? (
        <div>
          <h4>{user.name} (You)</h4>
          <p>Role: {user.role}</p>
          <p>Email: {user.username}@hrms.com</p>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Amit Sharma</td>
              <td>admin</td>
              <td>admin@hrms.com</td>
            </tr>
            <tr>
              <td>Priya Singh</td>
              <td>hr</td>
              <td>hr@hrms.com</td>
            </tr>
            <tr>
              <td>Ravi Kumar</td>
              <td>employee</td>
              <td>employee@hrms.com</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
} 