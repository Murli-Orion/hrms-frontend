import React, { useState, useEffect } from 'react';
import { fetchFromApi } from '../api';

export default function ReportsPage() {
  const [employeeStats, setEmployeeStats] = useState(null);
  const [orgStats, setOrgStats] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    loadData();
  }, [dateRange, selectedDepartment]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [empData, orgData, attendanceData, performanceData] = await Promise.all([
        fetchFromApi('employees'),
        fetchFromApi('posts'), // Using posts as org data
        fetchFromApi('attendance'),
        fetchFromApi('performance')
      ]);
      
      setEmployeeStats(empData.users ? empData.users.length : (empData.length || 0));
      setOrgStats(orgData.length || 0);
      setAttendanceData(attendanceData || []);
      setPerformanceData(performanceData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (data, key) => {
    const chartData = {};
    data.forEach(item => {
      const value = item[key] || 'Unknown';
      chartData[value] = (chartData[value] || 0) + 1;
    });
    return Object.entries(chartData).map(([label, value]) => ({ label, value }));
  };

  const getDepartmentStats = () => {
    if (!employeeStats) return [];
    // Simulate department data
    return [
      { name: 'Engineering', count: Math.floor(employeeStats * 0.4), color: '#007bff' },
      { name: 'Sales', count: Math.floor(employeeStats * 0.25), color: '#28a745' },
      { name: 'Marketing', count: Math.floor(employeeStats * 0.2), color: '#ffc107' },
      { name: 'HR', count: Math.floor(employeeStats * 0.15), color: '#dc3545' }
    ];
  };

  const getAttendanceTrend = () => {
    // Simulate attendance trend data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      present: Math.floor(Math.random() * 20) + 80,
      absent: Math.floor(Math.random() * 10) + 5,
      late: Math.floor(Math.random() * 15) + 5
    }));
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Reports & Analytics</h2>
              <p className="text-muted mb-0">Comprehensive HR analytics and insights</p>
            </div>
            <div className="d-flex gap-2">
              <select 
                className="form-select form-select-sm" 
                style={{ width: 'auto' }}
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <select 
                className="form-select form-select-sm" 
                style={{ width: 'auto' }}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="hr">HR</option>
              </select>
              <button className="btn btn-primary btn-sm">
                <i className="fas fa-download me-2"></i>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Employees</h6>
                  <h3 className="mb-0">{employeeStats}</h3>
                  <small className="opacity-75">+5% from last month</small>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Active Employees</h6>
                  <h3 className="mb-0">{Math.floor(employeeStats * 0.95)}</h3>
                  <small className="opacity-75">95% active rate</small>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-user-check fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Avg. Attendance</h6>
                  <h3 className="mb-0">92%</h3>
                  <small className="opacity-75">+2% from last month</small>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-calendar-check fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Departments</h6>
                  <h3 className="mb-0">{orgStats}</h3>
                  <small className="opacity-75">4 active departments</small>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-sitemap fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-chart-pie me-2"></i>
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => setActiveTab('attendance')}
              >
                <i className="fas fa-calendar-check me-2"></i>
                Attendance
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'performance' ? 'active' : ''}`}
                onClick={() => setActiveTab('performance')}
              >
                <i className="fas fa-chart-line me-2"></i>
                Performance
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'demographics' ? 'active' : ''}`}
                onClick={() => setActiveTab('demographics')}
              >
                <i className="fas fa-users me-2"></i>
                Demographics
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="row">
          <div className="col-md-8">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">Employee Distribution by Department</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {getDepartmentStats().map((dept, index) => (
                    <div key={index} className="col-md-6 mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{dept.name}</h6>
                          <div className="progress" style={{ height: '8px' }}>
                            <div 
                              className="progress-bar" 
                              style={{ 
                                width: `${(dept.count / employeeStats) * 100}%`,
                                backgroundColor: dept.color 
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">{dept.count}</div>
                          <small className="text-muted">
                            {Math.round((dept.count / employeeStats) * 100)}%
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">Quick Stats</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span>New Hires</span>
                  <span className="fw-bold text-success">+12</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Terminations</span>
                  <span className="fw-bold text-danger">-3</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Promotions</span>
                  <span className="fw-bold text-primary">+8</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Leave Requests</span>
                  <span className="fw-bold text-warning">25</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Training Hours</span>
                  <span className="fw-bold text-info">1,240</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="row">
          <div className="col-md-8">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">Weekly Attendance Trend</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Late</th>
                        <th>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getAttendanceTrend().map((day, index) => (
                        <tr key={index}>
                          <td className="fw-bold">{day.day}</td>
                          <td>
                            <span className="badge bg-success">{day.present}</span>
                          </td>
                          <td>
                            <span className="badge bg-danger">{day.absent}</span>
                          </td>
                          <td>
                            <span className="badge bg-warning">{day.late}</span>
                          </td>
                          <td>
                            <div className="progress" style={{ height: '6px' }}>
                              <div 
                                className="progress-bar bg-success" 
                                style={{ width: `${(day.present / (day.present + day.absent + day.late)) * 100}%` }}
                              ></div>
                            </div>
                            <small className="text-muted">
                              {Math.round((day.present / (day.present + day.absent + day.late)) * 100)}%
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">Attendance Summary</h5>
              </div>
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="display-4 fw-bold text-success">92%</div>
                  <div className="text-muted">Average Attendance Rate</div>
                </div>
                <div className="row text-center">
                  <div className="col-6">
                    <div className="fw-bold text-success">85%</div>
                    <small className="text-muted">On Time</small>
                  </div>
                  <div className="col-6">
                    <div className="fw-bold text-warning">7%</div>
                    <small className="text-muted">Late</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">Performance Distribution</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 text-center mb-3">
                    <div className="card bg-success text-white">
                      <div className="card-body">
                        <div className="display-6 fw-bold">45%</div>
                        <div>Exceeds Expectations</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 text-center mb-3">
                    <div className="card bg-primary text-white">
                      <div className="card-body">
                        <div className="display-6 fw-bold">35%</div>
                        <div>Meets Expectations</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 text-center mb-3">
                    <div className="card bg-warning text-white">
                      <div className="card-body">
                        <div className="display-6 fw-bold">15%</div>
                        <div>Needs Improvement</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 text-center mb-3">
                    <div className="card bg-danger text-white">
                      <div className="card-body">
                        <div className="display-6 fw-bold">5%</div>
                        <div>Below Expectations</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'demographics' && (
        <div className="row">
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">Age Distribution</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>20-30 years</span>
                    <span className="fw-bold">35%</span>
                  </div>
                  <div className="progress mb-2">
                    <div className="progress-bar bg-primary" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>31-40 years</span>
                    <span className="fw-bold">42%</span>
                  </div>
                  <div className="progress mb-2">
                    <div className="progress-bar bg-success" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>41-50 years</span>
                    <span className="fw-bold">18%</span>
                  </div>
                  <div className="progress mb-2">
                    <div className="progress-bar bg-warning" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>50+ years</span>
                    <span className="fw-bold">5%</span>
                  </div>
                  <div className="progress mb-2">
                    <div className="progress-bar bg-info" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">Gender Distribution</h5>
              </div>
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="row">
                    <div className="col-6">
                      <div className="display-4 fw-bold text-primary">58%</div>
                      <div className="text-muted">Male</div>
                    </div>
                    <div className="col-6">
                      <div className="display-4 fw-bold text-success">42%</div>
                      <div className="text-muted">Female</div>
                    </div>
                  </div>
                </div>
                <div className="progress" style={{ height: '20px' }}>
                  <div className="progress-bar bg-primary" style={{ width: '58%' }}>58%</div>
                  <div className="progress-bar bg-success" style={{ width: '42%' }}>42%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex align-items-center">
                  <div className="flex-shrink-0 me-3">
                    <i className="fas fa-user-plus text-success"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">New employee hired</div>
                    <small className="text-muted">Sarah Johnson joined Engineering team</small>
                  </div>
                  <small className="text-muted">2 hours ago</small>
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <div className="flex-shrink-0 me-3">
                    <i className="fas fa-trophy text-warning"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">Performance review completed</div>
                    <small className="text-muted">Monthly reviews for Sales team</small>
                  </div>
                  <small className="text-muted">1 day ago</small>
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <div className="flex-shrink-0 me-3">
                    <i className="fas fa-calendar-check text-primary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">Attendance report generated</div>
                    <small className="text-muted">Weekly attendance summary</small>
                  </div>
                  <small className="text-muted">3 days ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 