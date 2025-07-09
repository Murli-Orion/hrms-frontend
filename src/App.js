import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import EmployeeList from './components/Employee/EmployeeList';
import AttendancePage from './components/Attendance/AttendancePage';
import TimesheetPage from './components/Timesheets/TimesheetPage';
import LeavePage from './components/Leave/LeavePage';
import PayrollPage from './components/Payroll/PayrollPage';
import PerformancePage from './components/Performance/PerformancePage';
import ReportsPage from './pages/ReportsPage';
import NotificationEnginePage from './pages/NotificationEnginePage';
import SelfServicePage from './components/SelfService/SelfServicePage';
import Dashboard from './pages/Dashboard';
import OrgStructurePage from './pages/OrgStructurePage';
import DocumentsLettersPage from './pages/DocumentsLettersPage';
import OnboardingPage from './pages/OnboardingPage';
import EmployeeExitPage from './pages/EmployeeExitPage';
import AccessRolesPage from './pages/AccessRolesPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage';
import { useAuth } from './components/AuthContext';
import RequireRole from './components/RequireRole';

const menuTree = [
  {
    label: 'HR',
    icon: 'fa-users',
    children: [
      { path: '/employee', name: 'Employee Management', icon: 'fa-id-badge' },
      { path: '/attendance', name: 'Attendance', icon: 'fa-calendar-check' },
      { path: '/timesheets', name: 'Timesheets', icon: 'fa-clock' },
      { path: '/performance', name: 'Performance', icon: 'fa-chart-line' },
      { path: '/org-structure', name: 'Org Structure', icon: 'fa-sitemap' },
      { path: '/onboarding', name: 'Onboarding', icon: 'fa-user-plus' },
      { path: '/employee-exit', name: 'Employee Exit', icon: 'fa-user-minus' },
      { path: '/access-roles', name: 'Access Roles', icon: 'fa-user-shield' },
    ],
  },
  {
    label: 'Compensation',
    icon: 'fa-money-bill-wave',
    children: [
      { path: '/payroll', name: 'Payroll', icon: 'fa-file-invoice-dollar' },
      { path: '/leave', name: 'Leave Management', icon: 'fa-calendar-minus' },
    ],
  },
  {
    label: 'Analytics',
    icon: 'fa-chart-pie',
    children: [
      { path: '/reports', name: 'Reports', icon: 'fa-chart-bar' },
    ],
  },
  {
    label: 'Utilities',
    icon: 'fa-toolbox',
    children: [
      { path: '/notifications', name: 'Notification Engine', icon: 'fa-bell' },
      { path: '/self-service', name: 'Self-service', icon: 'fa-user-cog' },
      { path: '/documents-letters', name: 'Documents & Letters', icon: 'fa-file-alt' },
    ],
  },
];

function filterMenuByRole(menuTree, { isSuperAdmin, isAdmin, isHR, isEmployee }) {
  // Super Admin: all
  if (isSuperAdmin) return menuTree;
  // Admin: all except Super Admin
  if (isAdmin) {
    return menuTree.map(group => ({
      ...group,
      children: group.children.filter(item => item.path !== '/super-admin')
    }));
  }
  // HR: Only HR/employee management menus
  if (isHR) {
    return menuTree.map(group => ({
      ...group,
      children: group.children.filter(item =>
        ['/attendance', '/timesheets', '/performance', '/leave', '/employee', '/org-structure', '/documents-letters', '/self-service', '/reports'].includes(item.path)
      )
    })).filter(group => group.children.length > 0);
  }
  // Employee: Only self-service, profile, documents, attendance, leave
  if (isEmployee) {
    return menuTree.map(group => ({
      ...group,
      children: group.children.filter(item =>
        ['/self-service', '/profile', '/documents-letters', '/attendance', '/leave', '/reports'].includes(item.path)
      )
    })).filter(group => group.children.length > 0);
  }
  return [];
}

function BootstrapSidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { user, isSuperAdmin, isAdmin, isHR, isEmployee } = useAuth();
  const [openGroups, setOpenGroups] = useState({});
  const handleGroupToggle = (label) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };
  const filteredMenu = filterMenuByRole(menuTree, { isSuperAdmin, isAdmin, isHR, isEmployee });
  return (
    <aside className={`sidebar-modern-v2 d-flex flex-column`} style={{ width: collapsed ? 60 : 250, transition: 'width 0.2s' }}>
      <div className="sidebar-logo">
        <i className="fas fa-cubes"></i>
        {!collapsed && <span>HRMS</span>}
      </div>
      <div className="sidebar-scrollbar">
        <nav className="flex-grow-1 nav flex-column">
          <Link to="/" className={`sidebar-menu-item${location.pathname === '/' ? ' sidebar-menu-active' : ''}`}> 
            <i className="fas fa-home"></i>
            {!collapsed && <span>Dashboard</span>}
          </Link>
          <Link to="/profile" className={`sidebar-menu-item${location.pathname === '/profile' ? ' sidebar-menu-active' : ''}`}> 
            <i className="fas fa-user"></i>
            {!collapsed && <span>Profile</span>}
          </Link>
          {isAdmin && (
            <Link to="/settings" className={`sidebar-menu-item${location.pathname === '/settings' ? ' sidebar-menu-active' : ''}`}> 
              <i className="fas fa-cog"></i>
              {!collapsed && <span>Settings</span>}
            </Link>
          )}
          {isSuperAdmin && (
            <Link to="/super-admin" className={`sidebar-menu-item${location.pathname === '/super-admin' ? ' sidebar-menu-active' : ''}`}> 
              <i className="fas fa-user-shield"></i>
              {!collapsed && <span>Super Admin</span>}
            </Link>
          )}
          <div style={{ height: 8 }} />
          {filteredMenu.map((group, idx) => (
            <div key={group.label}>
              {!collapsed && <div className="sidebar-section">{group.label}</div>}
              <button
                className={`sidebar-menu-item${openGroups[group.label] ? ' fw-bold' : ''}`}
                style={{ color: '#e5eaf5', background: 'none', border: 'none' }}
                onClick={() => handleGroupToggle(group.label)}
                aria-expanded={!!openGroups[group.label]}
                aria-controls={`collapse-${group.label}`}
                tabIndex={0}
              >
                <i className={`fas ${group.icon}`}></i>
                {!collapsed && <span>{group.label}</span>}
                {!collapsed && (
                  <i className={`sidebar-menu-arrow fas fa-chevron-${openGroups[group.label] ? 'down' : 'right'}`}></i>
                )}
              </button>
              <div className={`sidebar-submenu${!(openGroups[group.label] && !collapsed) ? ' collapse' : ''}`} id={`collapse-${group.label}`}
                style={{ display: collapsed ? 'none' : undefined }}>
                {group.children.map((mod) => (
                  <Link
                    key={mod.path}
                    to={mod.path}
                    className={`sidebar-menu-item${location.pathname === mod.path ? ' sidebar-menu-active' : ''}`}
                    style={{ paddingLeft: 36 }}
                    title={collapsed ? mod.name : undefined}
                  >
                    <span className="sidebar-bullet"></span>
                    <i className={`fas ${mod.icon}`}></i>
                    {!collapsed && mod.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="text-center mb-3 mt-auto">
        <button className="btn btn-link text-secondary px-2" style={{ fontSize: 22 }} onClick={() => setCollapsed(c => !c)} title="Toggle Sidebar">
          <i className={`fas fa-angle-${collapsed ? 'right' : 'left'}`}></i>
        </button>
      </div>
    </aside>
  );
}

function TopHeader({ user, onLogout, onChangeUser }) {
  const [dropdown, setDropdown] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const notifications = [
    { id: 1, text: 'Payroll processed for May', time: '5m ago', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, text: 'New leave request from Jane', time: '20m ago', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, text: 'Attendance anomaly detected', time: '1h ago', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  ];
  const messages = [
    { id: 1, from: 'Emily Zhang', text: 'Can I get my payslip?', time: '2m ago', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { id: 2, from: 'Carlos Ruiz', text: 'Project update shared.', time: '30m ago', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  ];
  return (
    <header className="bg-white border-bottom d-flex justify-content-between align-items-center px-4 py-2 shadow-sm" style={{ minHeight: 64, position: 'sticky', top: 0, zIndex: 99, borderRadius: '0 0 1rem 1rem' }}>
      <div className="fs-4 fw-bold text-primary">HRMS Dashboard</div>
      <div className="d-flex align-items-center gap-3 position-relative">
        {/* Notification Icon */}
        <div className="position-relative">
          <button className="btn btn-link p-0 me-2" style={{ fontSize: 22 }} onClick={() => { setNotifOpen(o => !o); setMsgOpen(false); setDropdown(false); }}>
            <i className="fas fa-bell text-secondary"></i>
            {notifications.length > 0 && <span className="badge bg-danger position-absolute top-0 start-100 translate-middle p-1" style={{ fontSize: 10 }}>{notifications.length}</span>}
          </button>
          {notifOpen && (
            <div className="position-absolute end-0 mt-2 p-2 bg-white shadow rounded-4" style={{ minWidth: 280, top: '100%' }}>
              <div className="fw-semibold mb-2">Notifications</div>
              <ul className="list-unstyled mb-0">
                {notifications.map(n => (
                  <li key={n.id} className="d-flex align-items-center gap-2 mb-2">
                    <img src={n.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div className="small">{n.text}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{n.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Message Icon */}
        <div className="position-relative">
          <button className="btn btn-link p-0 me-2" style={{ fontSize: 22 }} onClick={() => { setMsgOpen(o => !o); setNotifOpen(false); setDropdown(false); }}>
            <i className="fas fa-envelope text-secondary"></i>
            {messages.length > 0 && <span className="badge bg-primary position-absolute top-0 start-100 translate-middle p-1" style={{ fontSize: 10 }}>{messages.length}</span>}
          </button>
          {msgOpen && (
            <div className="position-absolute end-0 mt-2 p-2 bg-white shadow rounded-4" style={{ minWidth: 280, top: '100%' }}>
              <div className="fw-semibold mb-2">Messages</div>
              <ul className="list-unstyled mb-0">
                {messages.map(m => (
                  <li key={m.id} className="d-flex align-items-center gap-2 mb-2">
                    <img src={m.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div className="small"><span className="fw-semibold">{m.from}:</span> {m.text}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{m.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* User Avatar Dropdown */}
        <div className="d-flex align-items-center gap-2 position-relative" style={{ cursor: 'pointer' }} onClick={() => { setDropdown(d => !d); setNotifOpen(false); setMsgOpen(false); }}>
          <span className="d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: '#6366f1', color: '#fff', borderRadius: '50%', fontSize: 22, boxShadow: '0 2px 8px #0001' }}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <i className="fas fa-user-circle"></i>
            )}
          </span>
          <div className="d-none d-md-block">
            <div className="fw-semibold">{user.name}</div>
            <div className="text-muted small">{user.role}</div>
          </div>
          <i className="fas fa-chevron-down text-secondary"></i>
          {dropdown && (
            <div className="position-absolute end-0 mt-2 user-popup-modern" style={{ top: '100%' }}>
              <div className="user-popup-header">
                <img src={user.avatar} alt={user.name} className="user-popup-avatar" />
                <div className="user-popup-header-info">
                  <div className="user-popup-header-name">{user.name}</div>
                  <div className="user-popup-header-role">{user.role}</div>
                </div>
              </div>
              <button className="user-popup-action"><i className="fas fa-user"></i> Profile</button>
              <button className="user-popup-action"><i className="fas fa-inbox"></i> Inbox</button>
              <button className="user-popup-action"><i className="fas fa-tasks"></i> Task Manager</button>
              <button className="user-popup-action"><i className="fas fa-cog"></i> Settings</button>
              <button className="user-popup-action"><i className="fas fa-wallet"></i> Bal: $7,12,950</button>
              <button className="user-popup-action"><i className="fas fa-headset"></i> Support</button>
              <button className="user-popup-action user-popup-logout" onClick={onLogout}><i className="fas fa-sign-out-alt"></i> Log Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, loading, logout } = useAuth();
  const toggleSidebar = () => setCollapsed((c) => !c);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {user ? (
          <Route
            path="*"
            element={
              <div className="d-flex">
                <BootstrapSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <div className="flex-grow-1" style={{ marginLeft: collapsed ? 60 : 250, transition: 'margin-left 0.2s', minHeight: '100vh', background: '#f8f9fa' }}>
                  <TopHeader user={user || {}} onLogout={logout} />
                  <div className="container-fluid pt-4">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/employee" element={<RequireRole allowedRoles={['Super Admin', 'Admin', 'HR']}><EmployeeList /></RequireRole>} />
                      <Route path="/attendance" element={<RequireRole allowedRoles={['Super Admin', 'Admin', 'HR', 'Employee']}><AttendancePage /></RequireRole>} />
                      <Route path="/timesheets" element={<RequireRole allowedRoles={['Super Admin', 'Admin', 'HR']}><TimesheetPage /></RequireRole>} />
                      <Route path="/leave" element={<RequireRole allowedRoles={['Super Admin', 'Admin', 'HR', 'Employee']}><LeavePage /></RequireRole>} />
                      <Route path="/payroll" element={<RequireRole allowedRoles={['Super Admin', 'Admin']}><PayrollPage /></RequireRole>} />
                      <Route path="/performance" element={<RequireRole allowedRoles={['Super Admin', 'Admin', 'HR']}><PerformancePage /></RequireRole>} />
                      <Route path="/reports" element={<RequireRole allowedRoles={['Super Admin', 'Admin', 'HR', 'Employee']}><ReportsPage /></RequireRole>} />
                      <Route path="/notifications" element={<RequireRole allowedRoles={['Super Admin', 'Admin']}><NotificationEnginePage /></RequireRole>} />
                      <Route path="/self-service" element={<RequireRole allowedRoles={['Super Admin', 'Admin', 'HR', 'Employee']}><SelfServicePage /></RequireRole>} />
                      <Route path="/org-structure" element={<RequireRole allowedRoles={['Super Admin', 'Admin', 'HR']}><OrgStructurePage /></RequireRole>} />
                      <Route path="/documents-letters" element={<RequireRole allowedRoles={['Super Admin', 'Admin', 'HR', 'Employee']}><DocumentsLettersPage /></RequireRole>} />
                      <Route path="/onboarding" element={<RequireRole allowedRoles={['Super Admin', 'Admin']}><OnboardingPage /></RequireRole>} />
                      <Route path="/employee-exit" element={<RequireRole allowedRoles={['Super Admin', 'Admin']}><EmployeeExitPage /></RequireRole>} />
                      <Route path="/access-roles" element={<RequireRole allowedRoles={['Super Admin', 'Admin']}><AccessRolesPage /></RequireRole>} />
                      <Route path="/settings" element={<RequireRole allowedRoles={['Super Admin', 'Admin']}><SettingsPage /></RequireRole>} />
                      <Route path="/profile" element={<RequireRole allowedRoles={['Super Admin', 'Admin', 'HR', 'Employee']}><ProfilePage /></RequireRole>} />
                      <Route path="/super-admin" element={<RequireRole allowedRoles={['Super Admin']}><SuperAdminDashboardPage /></RequireRole>} />
                    </Routes>
                  </div>
                </div>
    </div>
            }
          />
        ) : (
          <Route path="*" element={<LoginPage />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
