import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { fetchFromApi } from '../../api';

const TABS = ['My Performance', 'Team Performance'];

export default function PerformancePage() {
  const { isHR, isAdmin } = useAuth();
  const [tab, setTab] = useState(TABS[0]);
  const [theme, setTheme] = useState('light');
  const [summary, setSummary] = useState({ kras: 0, goals: 0, feedback: 0, appraisals: 0 });
  const [myPerformance, setMyPerformance] = useState([]);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchFromApi('performance') // You must set up this endpoint in mockapi.io or similar
      .then(data => {
        setMyPerformance(data.myPerformance || []);
        setTeamPerformance(data.teamPerformance || []);
        setSummary(data.summary || { kras: 0, goals: 0, feedback: 0, appraisals: 0 });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // const handleThemeToggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  if (loading) return <div>Loading performance data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className={`performance-dashboard theme-${theme}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Performance</h2>
        <button className="btn btn-outline-secondary" onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
      </div>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card p-3 mb-3">
            <div className="fw-bold">KRAs</div>
            <div style={{ fontSize: 28 }}>{summary.kras}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 mb-3">
            <div className="fw-bold">Goals</div>
            <div style={{ fontSize: 28 }}>{summary.goals}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 mb-3">
            <div className="fw-bold">Feedback</div>
            <div style={{ fontSize: 28 }}>{summary.feedback}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 mb-3">
            <div className="fw-bold">Appraisals</div>
            <div style={{ fontSize: 28 }}>{summary.appraisals}</div>
          </div>
        </div>
      </div>
      <div className="card p-3 mb-4">
        <div className="d-flex gap-3 mb-3">
          {TABS.map(t => (
            <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        {tab === 'My Performance' && (
          <table className="table table-bordered">
            <thead><tr><th>Type</th><th>Description</th><th>Status</th></tr></thead>
            <tbody>
              {myPerformance.map(p => (
                <tr key={p.id}><td>{p.type}</td><td>{p.desc}</td><td>{p.status}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'Team Performance' && (isHR || isAdmin) && (
          <table className="table table-bordered">
            <thead><tr><th>Employee</th><th>Type</th><th>Description</th><th>Status</th></tr></thead>
            <tbody>
              {teamPerformance.map(p => (
                <tr key={p.id}><td>{p.employee}</td><td>{p.type}</td><td>{p.desc}</td><td>{p.status}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 