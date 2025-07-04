import React, { useState } from 'react';

const reportsData = {
  attendance: [
    { month: 'Jan 2024', present: 85, absent: 8, late: 7, total: 100 },
    { month: 'Feb 2024', present: 88, absent: 6, late: 6, total: 100 },
    { month: 'Mar 2024', present: 82, absent: 10, late: 8, total: 100 },
    { month: 'Apr 2024', present: 90, absent: 5, late: 5, total: 100 },
    { month: 'May 2024', present: 87, absent: 7, late: 6, total: 100 },
    { month: 'Jun 2024', present: 89, absent: 6, late: 5, total: 100 },
    { month: 'Jul 2024', present: 84, absent: 9, late: 7, total: 100 },
    { month: 'Aug 2024', present: 91, absent: 4, late: 5, total: 100 },
    { month: 'Sep 2024', present: 86, absent: 8, late: 6, total: 100 },
    { month: 'Oct 2024', present: 88, absent: 6, late: 6, total: 100 },
    { month: 'Nov 2024', present: 85, absent: 8, late: 7, total: 100 },
    { month: 'Dec 2024', present: 92, absent: 3, late: 5, total: 100 },
  ],
  payroll: [
    { month: 'Jan 2024', totalSalary: 125000, bonuses: 15000, deductions: 12500, netPay: 127500 },
    { month: 'Feb 2024', totalSalary: 125000, bonuses: 12000, deductions: 12500, netPay: 124500 },
    { month: 'Mar 2024', totalSalary: 125000, bonuses: 18000, deductions: 12500, netPay: 130500 },
    { month: 'Apr 2024', totalSalary: 125000, bonuses: 14000, deductions: 12500, netPay: 126500 },
    { month: 'May 2024', totalSalary: 125000, bonuses: 16000, deductions: 12500, netPay: 128500 },
    { month: 'Jun 2024', totalSalary: 125000, bonuses: 13000, deductions: 12500, netPay: 125500 },
    { month: 'Jul 2024', totalSalary: 125000, bonuses: 17000, deductions: 12500, netPay: 129500 },
    { month: 'Aug 2024', totalSalary: 125000, bonuses: 11000, deductions: 12500, netPay: 123500 },
    { month: 'Sep 2024', totalSalary: 125000, bonuses: 19000, deductions: 12500, netPay: 131500 },
    { month: 'Oct 2024', totalSalary: 125000, bonuses: 14500, deductions: 12500, netPay: 127000 },
    { month: 'Nov 2024', totalSalary: 125000, bonuses: 15500, deductions: 12500, netPay: 128000 },
    { month: 'Dec 2024', totalSalary: 125000, bonuses: 25000, deductions: 12500, netPay: 137500 },
  ],
  performance: [
    { month: 'Jan 2024', excellent: 15, good: 45, average: 30, poor: 10 },
    { month: 'Feb 2024', excellent: 18, good: 42, average: 32, poor: 8 },
    { month: 'Mar 2024', excellent: 12, good: 48, average: 28, poor: 12 },
    { month: 'Apr 2024', excellent: 20, good: 40, average: 30, poor: 10 },
    { month: 'May 2024', excellent: 16, good: 44, average: 31, poor: 9 },
    { month: 'Jun 2024', excellent: 19, good: 41, average: 29, poor: 11 },
    { month: 'Jul 2024', excellent: 14, good: 46, average: 30, poor: 10 },
    { month: 'Aug 2024', excellent: 22, good: 38, average: 32, poor: 8 },
    { month: 'Sep 2024', excellent: 17, good: 43, average: 31, poor: 9 },
    { month: 'Oct 2024', excellent: 18, good: 42, average: 30, poor: 10 },
    { month: 'Nov 2024', excellent: 15, good: 45, average: 30, poor: 10 },
    { month: 'Dec 2024', excellent: 25, good: 35, average: 30, poor: 10 },
  ],
  leave: [
    { month: 'Jan 2024', approved: 45, pending: 12, rejected: 8, total: 65 },
    { month: 'Feb 2024', approved: 42, pending: 15, rejected: 6, total: 63 },
    { month: 'Mar 2024', approved: 48, pending: 10, rejected: 10, total: 68 },
    { month: 'Apr 2024', approved: 40, pending: 18, rejected: 7, total: 65 },
    { month: 'May 2024', approved: 44, pending: 14, rejected: 9, total: 67 },
    { month: 'Jun 2024', approved: 46, pending: 12, rejected: 8, total: 66 },
    { month: 'Jul 2024', approved: 43, pending: 16, rejected: 7, total: 66 },
    { month: 'Aug 2024', approved: 47, pending: 11, rejected: 9, total: 67 },
    { month: 'Sep 2024', approved: 41, pending: 17, rejected: 6, total: 64 },
    { month: 'Oct 2024', approved: 45, pending: 13, rejected: 8, total: 66 },
    { month: 'Nov 2024', approved: 44, pending: 14, rejected: 9, total: 67 },
    { month: 'Dec 2024', approved: 50, pending: 8, rejected: 5, total: 63 },
  ]
};

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Tooltip state for analytics
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, value: '', label: '' });

  const getFilteredData = () => {
    let data = reportsData[selectedReport];
    
    if (dateRange !== 'all') {
      const months = {
        '3months': 3,
        '6months': 6,
        '12months': 12
      };
      data = data.slice(-months[dateRange]);
    }
    
    return data;
  };

  const exportReport = () => {
    const data = getFilteredData();
    const csvContent = generateCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const getReportTitle = () => {
    const titles = {
      attendance: 'Attendance Report',
      payroll: 'Payroll Report',
      performance: 'Performance Report',
      leave: 'Leave Report'
    };
    return titles[selectedReport];
  };

  const getReportDescription = () => {
    const descriptions = {
      attendance: 'Monthly attendance statistics showing present, absent, and late employees',
      payroll: 'Monthly payroll summary including salaries, bonuses, and deductions',
      performance: 'Employee performance ratings distribution by month',
      leave: 'Leave request statistics showing approved, pending, and rejected requests'
    };
    return descriptions[selectedReport];
  };

  const renderChart = () => {
    const data = getFilteredData();
    
    if (selectedReport === 'attendance') {
      return (
        <div className="row g-3">
          {data.map((item, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title fw-bold">{item.month}</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-success">Present: {item.present}%</span>
                    <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
                      <div className="progress-bar bg-success" style={{ width: `${item.present}%` }}></div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-warning">Late: {item.late}%</span>
                    <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
                      <div className="progress-bar bg-warning" style={{ width: `${item.late}%` }}></div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-danger">Absent: {item.absent}%</span>
                    <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
                      <div className="progress-bar bg-danger" style={{ width: `${item.absent}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (selectedReport === 'payroll') {
      return (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Month</th>
                <th>Total Salary</th>
                <th>Bonuses</th>
                <th>Deductions</th>
                <th>Net Pay</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="fw-semibold">{item.month}</td>
                  <td>${item.totalSalary.toLocaleString()}</td>
                  <td className="text-success">${item.bonuses.toLocaleString()}</td>
                  <td className="text-danger">${item.deductions.toLocaleString()}</td>
                  <td className="fw-bold text-primary">${item.netPay.toLocaleString()}</td>
                  <td>
                    <div className="progress" style={{ height: '6px', width: '60px' }}>
                      <div 
                        className="progress-bar bg-primary" 
                        style={{ width: `${(item.netPay / 140000) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (selectedReport === 'performance') {
      return (
        <div className="row g-3">
          {data.map((item, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title fw-bold">{item.month}</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-success">Excellent: {item.excellent}%</span>
                    <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
                      <div className="progress-bar bg-success" style={{ width: `${item.excellent}%` }}></div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-info">Good: {item.good}%</span>
                    <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
                      <div className="progress-bar bg-info" style={{ width: `${item.good}%` }}></div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-warning">Average: {item.average}%</span>
                    <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
                      <div className="progress-bar bg-warning" style={{ width: `${item.average}%` }}></div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-danger">Poor: {item.poor}%</span>
                    <div className="progress flex-grow-1 mx-2" style={{ height: '8px' }}>
                      <div className="progress-bar bg-danger" style={{ width: `${item.poor}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (selectedReport === 'leave') {
      return (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Month</th>
                <th>Approved</th>
                <th>Pending</th>
                <th>Rejected</th>
                <th>Total</th>
                <th>Approval Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="fw-semibold">{item.month}</td>
                  <td><span className="badge bg-success">{item.approved}</span></td>
                  <td><span className="badge bg-warning">{item.pending}</span></td>
                  <td><span className="badge bg-danger">{item.rejected}</span></td>
                  <td className="fw-bold">{item.total}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${(item.approved / item.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="fw-semibold">{Math.round((item.approved / item.total) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  // --- DASHBOARD CARDS ---
  const renderDashboard = () => (
    <div className="row g-3">
      {/* Attendance Card */}
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body text-center">
            <h6 className="fw-bold mb-2">Attendance</h6>
            <div className="mb-2">
              <span className="text-success fw-bold">{reportsData.attendance[reportsData.attendance.length-1].present}%</span> Present
            </div>
            <div className="progress mb-2" style={{height:'8px'}}>
              <div className="progress-bar bg-success" style={{width:`${reportsData.attendance[reportsData.attendance.length-1].present}%`}}></div>
            </div>
            <div className="small text-muted">Last Month</div>
          </div>
        </div>
      </div>
      {/* Payroll Card */}
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body text-center">
            <h6 className="fw-bold mb-2">Payroll</h6>
            <div className="mb-2">
              <span className="text-primary fw-bold">${reportsData.payroll[reportsData.payroll.length-1].netPay.toLocaleString()}</span> Net Pay
            </div>
            <div className="progress mb-2" style={{height:'8px'}}>
              <div className="progress-bar bg-primary" style={{width:`${(reportsData.payroll[reportsData.payroll.length-1].netPay/140000)*100}%`}}></div>
            </div>
            <div className="small text-muted">Last Month</div>
          </div>
        </div>
      </div>
      {/* Performance Card */}
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body text-center">
            <h6 className="fw-bold mb-2">Performance</h6>
            <div className="mb-2">
              <span className="text-info fw-bold">{reportsData.performance[reportsData.performance.length-1].excellent}%</span> Excellent
            </div>
            <div className="progress mb-2" style={{height:'8px'}}>
              <div className="progress-bar bg-info" style={{width:`${reportsData.performance[reportsData.performance.length-1].excellent}%`}}></div>
            </div>
            <div className="small text-muted">Last Month</div>
          </div>
        </div>
      </div>
      {/* Leave Card */}
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body text-center">
            <h6 className="fw-bold mb-2">Leave</h6>
            <div className="mb-2">
              <span className="text-warning fw-bold">{reportsData.leave[reportsData.leave.length-1].approved}</span> Approved
            </div>
            <div className="progress mb-2" style={{height:'8px'}}>
              <div className="progress-bar bg-warning" style={{width:`${(reportsData.leave[reportsData.leave.length-1].approved/reportsData.leave[reportsData.leave.length-1].total)*100}%`}}></div>
            </div>
            <div className="small text-muted">Last Month</div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- ANALYTICS CHARTS (simple bar charts using divs) ---
  const handleBarMouseOver = (e, value, label) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      value,
      label
    });
  };
  const handleBarMouseOut = () => setTooltip({ ...tooltip, show: false });

  const renderAnalytics = () => (
    <div style={{position:'relative'}}>
      {/* Description */}
      <div className="mb-4">
        <div className="alert alert-info p-2 mb-2" style={{fontSize:'0.95rem'}}>
          <strong>Analytics Overview:</strong> Visualize trends for Attendance, Payroll, Performance, and Leave over the last 6 months. Hover over any bar to see exact values.
        </div>
      </div>
      {/* Attendance Analytics */}
      <div className="mb-4">
        <h6 className="fw-bold mb-1">Attendance Trend <span className="badge bg-success ms-2">Present %</span></h6>
        <div className="d-flex align-items-end" style={{height:'140px',gap:'8px',position:'relative'}}>
          {/* Y-axis label */}
          <div style={{writingMode:'vertical-lr',transform:'rotate(180deg)',fontSize:'0.8rem',color:'#888',marginRight:'6px'}}>Present %</div>
          {reportsData.attendance.slice(-6).map((item,idx) => (
            <div key={idx} style={{flex:1,textAlign:'center',position:'relative'}}>
              <div 
                style={{background:'#198754',height:`${item.present}px`,borderRadius:'4px 4px 0 0',cursor:'pointer'}}
                onMouseOver={e=>handleBarMouseOver(e, item.present+'%', item.month)}
                onMouseOut={handleBarMouseOut}
              ></div>
              <div className="small text-muted">{item.month.slice(0,3)}</div>
            </div>
          ))}
        </div>
        <div className="small text-muted mt-1">Legend: <span className="badge bg-success">Present %</span></div>
      </div>
      {/* Payroll Analytics */}
      <div className="mb-4">
        <h6 className="fw-bold mb-1">Payroll Net Pay <span className="badge bg-primary ms-2">Net Pay ($)</span></h6>
        <div className="d-flex align-items-end" style={{height:'140px',gap:'8px',position:'relative'}}>
          <div style={{writingMode:'vertical-lr',transform:'rotate(180deg)',fontSize:'0.8rem',color:'#888',marginRight:'6px'}}>$</div>
          {reportsData.payroll.slice(-6).map((item,idx) => (
            <div key={idx} style={{flex:1,textAlign:'center',position:'relative'}}>
              <div 
                style={{background:'#0d6efd',height:`${item.netPay/1500}px`,borderRadius:'4px 4px 0 0',cursor:'pointer'}}
                onMouseOver={e=>handleBarMouseOver(e, '$'+item.netPay.toLocaleString(), item.month)}
                onMouseOut={handleBarMouseOut}
              ></div>
              <div className="small text-muted">{item.month.slice(0,3)}</div>
            </div>
          ))}
        </div>
        <div className="small text-muted mt-1">Legend: <span className="badge bg-primary">Net Pay</span></div>
      </div>
      {/* Performance Analytics */}
      <div className="mb-4">
        <h6 className="fw-bold mb-1">Performance <span className="badge bg-info ms-2">Excellent %</span></h6>
        <div className="d-flex align-items-end" style={{height:'140px',gap:'8px',position:'relative'}}>
          <div style={{writingMode:'vertical-lr',transform:'rotate(180deg)',fontSize:'0.8rem',color:'#888',marginRight:'6px'}}>Excellent %</div>
          {reportsData.performance.slice(-6).map((item,idx) => (
            <div key={idx} style={{flex:1,textAlign:'center',position:'relative'}}>
              <div 
                style={{background:'#0dcaf0',height:`${item.excellent}px`,borderRadius:'4px 4px 0 0',cursor:'pointer'}}
                onMouseOver={e=>handleBarMouseOver(e, item.excellent+'%', item.month)}
                onMouseOut={handleBarMouseOut}
              ></div>
              <div className="small text-muted">{item.month.slice(0,3)}</div>
            </div>
          ))}
        </div>
        <div className="small text-muted mt-1">Legend: <span className="badge bg-info">Excellent %</span></div>
      </div>
      {/* Leave Analytics */}
      <div className="mb-4">
        <h6 className="fw-bold mb-1">Leave Approved <span className="badge bg-warning ms-2">Approved</span></h6>
        <div className="d-flex align-items-end" style={{height:'140px',gap:'8px',position:'relative'}}>
          <div style={{writingMode:'vertical-lr',transform:'rotate(180deg)',fontSize:'0.8rem',color:'#888',marginRight:'6px'}}>Approved</div>
          {reportsData.leave.slice(-6).map((item,idx) => (
            <div key={idx} style={{flex:1,textAlign:'center',position:'relative'}}>
              <div 
                style={{background:'#ffc107',height:`${item.approved*2}px`,borderRadius:'4px 4px 0 0',cursor:'pointer'}}
                onMouseOver={e=>handleBarMouseOver(e, item.approved, item.month)}
                onMouseOut={handleBarMouseOut}
              ></div>
              <div className="small text-muted">{item.month.slice(0,3)}</div>
            </div>
          ))}
        </div>
        <div className="small text-muted mt-1">Legend: <span className="badge bg-warning">Approved</span></div>
      </div>
      {/* Tooltip */}
      {tooltip.show && (
        <div style={{
          position:'fixed',
          left: tooltip.x,
          top: tooltip.y,
          background:'#222',
          color:'#fff',
          padding:'4px 10px',
          borderRadius:'4px',
          fontSize:'0.95rem',
          pointerEvents:'none',
          zIndex:9999,
          transform:'translate(-50%,-100%)',
          whiteSpace:'nowrap',
          boxShadow:'0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <span className="fw-bold">{tooltip.value}</span> <span className="ms-2">({tooltip.label})</span>
        </div>
      )}
    </div>
  );

  // --- EXPORT HANDLER (works for all tabs) ---
  const handleExport = () => {
    let data = [];
    let filename = '';
    if (activeTab === 'dashboard') {
      data = [
        { Module: 'Attendance', Present: reportsData.attendance[reportsData.attendance.length-1].present },
        { Module: 'Payroll', NetPay: reportsData.payroll[reportsData.payroll.length-1].netPay },
        { Module: 'Performance', Excellent: reportsData.performance[reportsData.performance.length-1].excellent },
        { Module: 'Leave', Approved: reportsData.leave[reportsData.leave.length-1].approved },
      ];
      filename = 'dashboard_summary';
    } else if (activeTab === 'analytics') {
      data = [
        ...reportsData.attendance.slice(-6).map(item => ({ Module: 'Attendance', Month: item.month, Present: item.present })),
        ...reportsData.payroll.slice(-6).map(item => ({ Module: 'Payroll', Month: item.month, NetPay: item.netPay })),
        ...reportsData.performance.slice(-6).map(item => ({ Module: 'Performance', Month: item.month, Excellent: item.excellent })),
        ...reportsData.leave.slice(-6).map(item => ({ Module: 'Leave', Month: item.month, Approved: item.approved })),
      ];
      filename = 'analytics_trends';
    } else {
      data = getFilteredData();
      filename = `${selectedReport}_report`;
    }
    const csvContent = generateCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // --- TABS NAVIGATION ---
  return (
    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '1rem' }}>
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link${activeTab==='dashboard'?' active':''}`} onClick={()=>setActiveTab('dashboard')}>Dashboards</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link${activeTab==='analytics'?' active':''}`} onClick={()=>setActiveTab('analytics')}>Analytics</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link${activeTab==='reports'?' active':''}`} onClick={()=>setActiveTab('reports')}>Raw Reports</button>
        </li>
      </ul>
      {/* Export Button */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary btn-sm" onClick={handleExport}>
          <i className="fas fa-download me-2"></i>Export
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div>
          {renderDashboard()}
        </div>
      )}
      {activeTab === 'analytics' && (
        <div>
          {renderAnalytics()}
        </div>
      )}
      {activeTab === 'reports' && (
        <div>
          {/* Filters */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1">{getReportTitle()}</h4>
              <p className="text-muted mb-0">{getReportDescription()}</p>
            </div>
            <button 
              className="btn btn-outline-secondary btn-sm" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fas fa-filter me-2"></i>Filters
            </button>
          </div>
          {showFilters && (
            <div className="card border-0 bg-light mb-4">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Report Type</label>
                    <select 
                      className="form-select" 
                      value={selectedReport} 
                      onChange={(e) => setSelectedReport(e.target.value)}
                    >
                      <option value="attendance">Attendance Report</option>
                      <option value="payroll">Payroll Report</option>
                      <option value="performance">Performance Report</option>
                      <option value="leave">Leave Report</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Date Range</label>
                    <select 
                      className="form-select" 
                      value={dateRange} 
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="all">All Time</option>
                      <option value="3months">Last 3 Months</option>
                      <option value="6months">Last 6 Months</option>
                      <option value="12months">Last 12 Months</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Report Content */}
          <div className="mt-4">
            {renderChart()}
          </div>
          {/* Summary Stats */}
          <div className="row g-3 mt-4">
            <div className="col-md-3">
              <div className="card border-0 bg-primary bg-opacity-10">
                <div className="card-body text-center">
                  <h5 className="text-primary fw-bold">{getFilteredData().length}</h5>
                  <p className="text-muted mb-0">Data Points</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 bg-success bg-opacity-10">
                <div className="card-body text-center">
                  <h5 className="text-success fw-bold">
                    {selectedReport === 'attendance' && getFilteredData().reduce((sum, item) => sum + item.present, 0) / getFilteredData().length}
                    {selectedReport === 'payroll' && '$' + Math.round(getFilteredData().reduce((sum, item) => sum + item.netPay, 0) / getFilteredData().length).toLocaleString()}
                    {selectedReport === 'performance' && Math.round(getFilteredData().reduce((sum, item) => sum + item.excellent, 0) / getFilteredData().length) + '%'}
                    {selectedReport === 'leave' && Math.round(getFilteredData().reduce((sum, item) => sum + (item.approved / item.total * 100), 0) / getFilteredData().length) + '%'}
                  </h5>
                  <p className="text-muted mb-0">Average</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 bg-info bg-opacity-10">
                <div className="card-body text-center">
                  <h5 className="text-info fw-bold">
                    {selectedReport === 'attendance' && getFilteredData().reduce((sum, item) => sum + item.absent, 0)}
                    {selectedReport === 'payroll' && '$' + getFilteredData().reduce((sum, item) => sum + item.totalSalary, 0).toLocaleString()}
                    {selectedReport === 'performance' && getFilteredData().reduce((sum, item) => sum + item.good, 0)}
                    {selectedReport === 'leave' && getFilteredData().reduce((sum, item) => sum + item.approved, 0)}
                  </h5>
                  <p className="text-muted mb-0">Total</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 bg-warning bg-opacity-10">
                <div className="card-body text-center">
                  <h5 className="text-warning fw-bold">
                    {getFilteredData().length > 1 ? 
                      (selectedReport === 'attendance' && getFilteredData()[getFilteredData().length - 1].present - getFilteredData()[getFilteredData().length - 2].present)
                      : 0}
                    {selectedReport === 'payroll' && '$' + (getFilteredData().length > 1 ? 
                      (getFilteredData()[getFilteredData().length - 1].netPay - getFilteredData()[getFilteredData().length - 2].netPay).toLocaleString()
                      : 0)}
                    {selectedReport === 'performance' && getFilteredData().length > 1 ? 
                      (getFilteredData()[getFilteredData().length - 1].excellent - getFilteredData()[getFilteredData().length - 2].excellent)
                      : 0}
                    {selectedReport === 'leave' && getFilteredData().length > 1 ? 
                      (getFilteredData()[getFilteredData().length - 1].approved - getFilteredData()[getFilteredData().length - 2].approved)
                      : 0}
                  </h5>
                  <p className="text-muted mb-0">Change</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 