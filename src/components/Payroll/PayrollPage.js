import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';

const TABS = ['My Payslips', 'Team Payroll'];
const summary = { ctc: '₹8,00,000', payslips: 12, compliance: 'OK', reimbursements: 3 };
const myPayslips = [
  { id: 1, month: 'May 2024', amount: '₹66,000', status: 'Paid' },
  { id: 2, month: 'Apr 2024', amount: '₹66,000', status: 'Paid' },
];
const teamPayroll = [
  { id: 3, employee: 'Priya Singh', month: 'May 2024', amount: '₹70,000', status: 'Paid' },
];

export default function PayrollPage() {
  const { isHR, isAdmin, user } = useAuth();
  const [tab, setTab] = useState(TABS[0]);
  const [theme, setTheme] = useState('light');
  const handleThemeToggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className={`payroll-dashboard theme-${theme}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Payroll</h2>
        <button className="btn btn-outline-secondary" onClick={handleThemeToggle}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
      </div>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card p-3 mb-3">
            <div className="fw-bold">CTC</div>
            <div style={{ fontSize: 28 }}>{summary.ctc}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 mb-3">
            <div className="fw-bold">Payslips</div>
            <div style={{ fontSize: 28 }}>{summary.payslips}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 mb-3">
            <div className="fw-bold">Compliance</div>
            <div style={{ fontSize: 28 }}>{summary.compliance}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 mb-3">
            <div className="fw-bold">Reimbursements</div>
            <div style={{ fontSize: 28 }}>{summary.reimbursements}</div>
          </div>
        </div>
      </div>
      <div className="card p-3 mb-4">
        <div className="d-flex gap-3 mb-3">
          {TABS.map(t => (
            <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        {tab === 'My Payslips' && (
          <table className="table table-bordered">
            <thead><tr><th>Month</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {myPayslips.map(p => (
                <tr key={p.id}><td>{p.month}</td><td>{p.amount}</td><td>{p.status}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'Team Payroll' && (isHR || isAdmin) && (
          <table className="table table-bordered">
            <thead><tr><th>Employee</th><th>Month</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {teamPayroll.map(p => (
                <tr key={p.id}><td>{p.employee}</td><td>{p.month}</td><td>{p.amount}</td><td>{p.status}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 