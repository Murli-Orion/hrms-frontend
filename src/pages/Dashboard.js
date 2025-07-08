import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
// import OrgChart from '../components/Employee/OrgChart';
// import DepartmentDisplay from '../components/Employee/DepartmentDisplay';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const kpis = [
  { label: 'Employees', value: '120', icon: 'fa-users', color: '#6366f1' },
  { label: 'Attendance', value: '98%', icon: 'fa-calendar-check', color: '#10b981' },
  { label: 'Projects', value: '8', icon: 'fa-briefcase', color: '#f59e42' },
  { label: 'Revenue', value: '$120K', icon: 'fa-dollar-sign', color: '#f43f5e' },
];

const activities = [
  { user: 'John Doe', action: 'Checked in', time: '10 mins ago', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { user: 'Jane Smith', action: 'Submitted timesheet', time: '20 mins ago', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { user: 'Carlos Ruiz', action: 'Requested leave', time: '1 hour ago', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { user: 'Emily Zhang', action: 'Completed project', time: '2 hours ago', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
];

const todos = [
  { task: 'Approve payroll', done: false },
  { task: 'Review attendance', done: true },
  { task: 'Check leave requests', done: false },
  { task: 'Send performance feedback', done: false },
];

const quickActions = [
  { label: 'Add Employee', icon: 'fa-user-plus', color: '#6366f1' },
  { label: 'Request Leave', icon: 'fa-calendar-plus', color: '#10b981' },
  { label: 'Log Attendance', icon: 'fa-calendar-check', color: '#f59e42' },
  { label: 'Generate Payslip', icon: 'fa-file-invoice-dollar', color: '#f43f5e' },
];

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Attendance %',
      data: [97, 98, 96, 99, 98, 97, 98],
      fill: true,
      backgroundColor: 'rgba(99,102,241,0.08)',
      borderColor: '#6366f1',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1',
    },
  ],
};
const chartOptions = {
  plugins: { legend: { display: false } },
  scales: {
    y: { min: 90, max: 100, ticks: { stepSize: 2, color: '#888', font: { family: 'Inter' } } },
    x: { ticks: { color: '#888', font: { family: 'Inter' } } },
  },
  elements: { line: { borderWidth: 3 } },
  responsive: true,
  maintainAspectRatio: false,
};

export default function Dashboard() {
  return (
    <div className="row g-4">
      {/* KPI Cards */}
      {kpis.map((kpi, idx) => (
        <div className="col-12 col-sm-6 col-lg-3" key={kpi.label}>
          <div className="card shadow-sm border-0 h-100 p-3 d-flex flex-row align-items-center gap-3" style={{ borderRadius: '1rem' }}>
            <span className="d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: kpi.color, color: '#fff', borderRadius: '1rem', fontSize: 24 }}>
              <i className={`fas ${kpi.icon}`}></i>
            </span>
            <div>
              <div className="fw-bold fs-4">{kpi.value}</div>
              <div className="text-muted small">{kpi.label}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Org Chart Widget */}
      <div className="col-12 mb-4">
        {/* <OrgChart /> */}
      </div>

      {/* Attendance Trend Chart */}
      <div className="col-12 col-lg-8">
        <div className="card shadow-sm border-0 mb-4 p-4" style={{ borderRadius: '1rem', minHeight: 320 }}>
          <div className="fw-semibold mb-3 fs-5">Attendance Trend</div>
          <div style={{ height: 220 }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '1rem' }}>
          <div className="fw-semibold mb-3 fs-5">Recent Activity</div>
          <ul className="list-unstyled mb-0">
            {activities.map((act, idx) => (
              <li key={idx} className="d-flex align-items-center gap-3 mb-3">
                <img src={act.avatar} alt={act.user} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div className="fw-semibold">{act.user}</div>
                  <div className="text-muted small">{act.action} • {act.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-12 col-lg-4">
        <div className="card shadow-sm border-0 h-100 p-4 mb-4" style={{ borderRadius: '1rem' }}>
          <div className="fw-semibold mb-3 fs-5">To-Do</div>
          <ul className="list-unstyled mb-0">
            {todos.map((todo, idx) => (
              <li key={idx} className="d-flex align-items-center gap-2 mb-2">
                <input type="checkbox" checked={todo.done} readOnly className="form-check-input" />
                <span className={todo.done ? 'text-muted text-decoration-line-through' : ''}>{todo.task}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: '1rem' }}>
          <div className="fw-semibold mb-3 fs-5">Quick Actions</div>
          <div className="d-flex flex-wrap gap-3">
            {quickActions.map((action, idx) => (
              <button key={action.label} className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm" style={{ background: action.color, color: '#fff', fontWeight: 600, fontFamily: 'Inter', fontSize: 15 }}>
                <i className={`fas ${action.icon}`}></i> {action.label}
              </button>
            ))}
          </div>
        </div>
        {/* <DepartmentDisplay /> */}
      </div>
    </div>
  );
} 