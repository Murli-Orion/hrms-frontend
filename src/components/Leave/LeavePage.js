import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';

const TABS = ['My Leaves', 'Team Leaves', 'Calendar'];
const leaveSummary = { balance: 12, pending: 2, approved: 8 };
const myLeaves = [
  { id: 1, type: 'Sick', from: '2024-06-01', to: '2024-06-02', status: 'Approved' },
  { id: 2, type: 'Casual', from: '2024-06-10', to: '2024-06-10', status: 'Pending' },
];
const teamLeaves = [
  { id: 3, employee: 'Priya Singh', type: 'Sick', from: '2024-06-05', to: '2024-06-06', status: 'Pending' },
];

export default function LeavePage() {
  const { isHR, isAdmin, user } = useAuth();
  const [tab, setTab] = useState(TABS[0]);
  const [theme, setTheme] = useState('light');
  const handleThemeToggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className={`leave-dashboard theme-${theme}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Leave Management</h2>
        <button className="btn btn-outline-secondary" onClick={handleThemeToggle}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
      </div>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <div className="fw-bold">Leave Balance</div>
            <div style={{ fontSize: 28 }}>{leaveSummary.balance} days</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <div className="fw-bold">Pending Requests</div>
            <div style={{ fontSize: 28 }}>{leaveSummary.pending}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <div className="fw-bold">Approved Leaves</div>
            <div style={{ fontSize: 28 }}>{leaveSummary.approved}</div>
          </div>
        </div>
      </div>
      <div className="card p-3 mb-4">
        <div className="d-flex gap-3 mb-3">
          {TABS.map(t => (
            <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        {tab === 'My Leaves' && (
          <table className="table table-bordered">
            <thead><tr><th>Type</th><th>From</th><th>To</th><th>Status</th></tr></thead>
            <tbody>
              {myLeaves.map(l => (
                <tr key={l.id}><td>{l.type}</td><td>{l.from}</td><td>{l.to}</td><td>{l.status}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'Team Leaves' && (isHR || isAdmin) && (
          <table className="table table-bordered">
            <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Status</th></tr></thead>
            <tbody>
              {teamLeaves.map(l => (
                <tr key={l.id}><td>{l.employee}</td><td>{l.type}</td><td>{l.from}</td><td>{l.to}</td><td>{l.status}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'Calendar' && (
          <div className="calendar-view">(Static leave calendar here)</div>
        )}
      </div>
    </div>
  );
} 