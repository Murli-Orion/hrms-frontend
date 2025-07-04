import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

const timesheetData = [
  { id: 1, employee: 'John Doe', project: 'Warehouse Management', date: '2024-01-15', hours: 8.5, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 2, employee: 'Jane Smith', project: 'Delivery Routes', date: '2024-01-15', hours: 9.0, status: 'Pending', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 3, employee: 'Carlos Ruiz', project: 'Operations Planning', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 4, employee: 'Emily Zhang', project: 'Customer Support', date: '2024-01-15', hours: 7.5, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 5, employee: 'Michael Johnson', project: 'System Development', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { id: 6, employee: 'Sarah Wilson', project: 'HR Administration', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
  { id: 7, employee: 'David Brown', project: 'Financial Reporting', date: '2024-01-15', hours: 8.5, status: 'Pending', avatar: 'https://randomuser.me/api/portraits/men/55.jpg' },
  { id: 8, employee: 'Lisa Anderson', project: 'Marketing Campaign', date: '2024-01-15', hours: 7.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/women/66.jpg' },
  { id: 9, employee: 'Robert Taylor', project: 'Inventory Management', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/77.jpg' },
  { id: 10, employee: 'Amanda Garcia', project: 'Fleet Coordination', date: '2024-01-15', hours: 8.5, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/women/88.jpg' },
  { id: 11, employee: 'James Martinez', project: 'Process Optimization', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/99.jpg' },
  { id: 12, employee: 'Jennifer Lee', project: 'Customer Relations', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/women/11.jpg' },
  { id: 13, employee: 'Christopher White', project: 'IT Infrastructure', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
  { id: 14, employee: 'Michelle Rodriguez', project: 'Recruitment', date: '2024-01-15', hours: 7.5, status: 'Pending', avatar: 'https://randomuser.me/api/portraits/women/13.jpg' },
  { id: 15, employee: 'Daniel Thompson', project: 'Budget Analysis', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/14.jpg' },
  { id: 16, employee: 'Nicole Clark', project: 'Brand Management', date: '2024-01-15', hours: 7.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/women/15.jpg' },
  { id: 17, employee: 'Kevin Lewis', project: 'Order Processing', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/16.jpg' },
  { id: 18, employee: 'Stephanie Hall', project: 'Route Planning', date: '2024-01-15', hours: 8.5, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/women/17.jpg' },
  { id: 19, employee: 'Andrew Young', project: 'Quality Control', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/18.jpg' },
  { id: 20, employee: 'Rachel King', project: 'Client Support', date: '2024-01-15', hours: 7.5, status: 'Pending', avatar: 'https://randomuser.me/api/portraits/women/19.jpg' },
  { id: 21, employee: 'Thomas Wright', project: 'Technical Support', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/20.jpg' },
  { id: 22, employee: 'Jessica Lopez', project: 'Talent Acquisition', date: '2024-01-15', hours: 7.5, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/women/21.jpg' },
  { id: 23, employee: 'Ryan Hill', project: 'Cost Management', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/23.jpg' },
  { id: 24, employee: 'Ashley Scott', project: 'Content Creation', date: '2024-01-15', hours: 7.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/women/24.jpg' },
  { id: 25, employee: 'Brandon Green', project: 'Warehouse Operations', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/25.jpg' },
  { id: 26, employee: 'Megan Adams', project: 'Vehicle Maintenance', date: '2024-01-15', hours: 8.5, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/women/26.jpg' },
  { id: 27, employee: 'Justin Baker', project: 'Strategic Planning', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/27.jpg' },
  { id: 28, employee: 'Lauren Nelson', project: 'Service Management', date: '2024-01-15', hours: 7.5, status: 'Pending', avatar: 'https://randomuser.me/api/portraits/women/28.jpg' },
  { id: 29, employee: 'Tyler Carter', project: 'Network Security', date: '2024-01-15', hours: 8.0, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/men/29.jpg' },
  { id: 30, employee: 'Hannah Mitchell', project: 'Benefits Administration', date: '2024-01-15', hours: 7.5, status: 'Approved', avatar: 'https://randomuser.me/api/portraits/women/30.jpg' },
];

const statusColor = {
  'Approved': 'success',
  'Pending': 'warning',
  'Rejected': 'danger',
};

const projects = [
  'Warehouse Management', 'Delivery Routes', 'Operations Planning', 'Customer Support', 
  'System Development', 'HR Administration', 'Financial Reporting', 'Marketing Campaign',
  'Inventory Management', 'Fleet Coordination', 'Process Optimization', 'Customer Relations',
  'IT Infrastructure', 'Recruitment', 'Budget Analysis', 'Brand Management', 'Order Processing',
  'Route Planning', 'Quality Control', 'Client Support', 'Technical Support', 'Talent Acquisition',
  'Cost Management', 'Content Creation', 'Warehouse Operations', 'Vehicle Maintenance',
  'Strategic Planning', 'Service Management', 'Network Security', 'Benefits Administration'
];

const employees = [
  'John Doe', 'Jane Smith', 'Carlos Ruiz', 'Emily Zhang', 'Michael Johnson', 'Sarah Wilson', 
  'David Brown', 'Lisa Anderson', 'Robert Taylor', 'Amanda Garcia', 'James Martinez', 
  'Jennifer Lee', 'Christopher White', 'Michelle Rodriguez', 'Daniel Thompson', 'Nicole Clark',
  'Kevin Lewis', 'Stephanie Hall', 'Andrew Young', 'Rachel King', 'Thomas Wright', 
  'Jessica Lopez', 'Ryan Hill', 'Ashley Scott', 'Brandon Green', 'Megan Adams', 
  'Justin Baker', 'Lauren Nelson', 'Tyler Carter', 'Hannah Mitchell'
];

const customStyles = {
  headRow: {
    style: {
      backgroundColor: '#232b3e',
      color: '#fff',
      fontWeight: 600,
      fontSize: '1.05rem',
      borderTop: '1px solid #313a55',
      borderBottom: '2px solid #313a55',
      minHeight: '48px',
      boxShadow: '0 4px 18px 0 #232b3e22',
    },
  },
  headCells: {
    style: {
      color: '#fff',
      backgroundColor: '#232b3e',
      borderRight: '1px solid #313a55',
      borderLeft: '1px solid #313a55',
      whiteSpace: 'normal',
      textOverflow: 'unset',
      overflow: 'visible',
    },
  },
  rows: {
    style: {
      borderBottom: '1px solid #e5eaf5',
      borderTop: '1px solid #e5eaf5',
      fontSize: '1rem',
      minHeight: '44px',
      boxShadow: '0 2px 8px #232b3e0a',
      whiteSpace: 'normal',
      textOverflow: 'unset',
      overflow: 'visible',
    },
    stripedStyle: {
      backgroundColor: '#232b3e0a',
    },
  },
  cells: {
    style: {
      borderRight: '1px solid #e5eaf5',
      borderLeft: '1px solid #e5eaf5',
      backgroundColor: '#fff',
      whiteSpace: 'normal',
      textOverflow: 'unset',
      overflow: 'visible',
    },
  },
};

export default function TimesheetPage() {
  const [timesheetList, setTimesheetList] = useState(timesheetData);
  const [showModal, setShowModal] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState(null);
  const [formData, setFormData] = useState({
    employee: '',
    project: '',
    date: '',
    hours: '',
    status: 'Pending'
  });
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');

  const handleAddTimesheet = () => {
    setEditingTimesheet(null);
    setFormData({
      employee: '',
      project: '',
      date: new Date().toISOString().split('T')[0],
      hours: '',
      status: 'Pending'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditTimesheet = (timesheet) => {
    setEditingTimesheet(timesheet);
    setFormData({
      employee: timesheet.employee,
      project: timesheet.project,
      date: timesheet.date,
      hours: timesheet.hours,
      status: timesheet.status
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDeleteTimesheet = (id) => {
    if (window.confirm('Are you sure you want to delete this timesheet entry?')) {
      setTimesheetList(prev => prev.filter(ts => ts.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee) newErrors.employee = 'Employee is required';
    if (!formData.project) newErrors.project = 'Project is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.hours) {
      newErrors.hours = 'Hours worked is required';
    } else if (isNaN(formData.hours) || parseFloat(formData.hours) <= 0) {
      newErrors.hours = 'Hours must be a positive number';
    } else if (parseFloat(formData.hours) > 24) {
      newErrors.hours = 'Hours cannot exceed 24';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      hours: parseFloat(formData.hours)
    };

    if (editingTimesheet) {
      // Update existing timesheet
      setTimesheetList(prev => prev.map(ts => 
        ts.id === editingTimesheet.id 
          ? { ...ts, ...submitData }
          : ts
      ));
    } else {
      // Add new timesheet
      const newTimesheet = {
        id: Math.max(...timesheetList.map(ts => ts.id)) + 1,
        ...submitData,
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`
      };
      setTimesheetList(prev => [...prev, newTimesheet]);
    }
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const columns = [
    {
      name: 'Avatar',
      selector: row => row.avatar,
      cell: row => <img src={row.avatar} alt={row.employee} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />, 
      width: '70px',
      sortable: false,
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: 'Employee',
      selector: row => row.employee,
      sortable: true,
      cell: row => <span className="fw-semibold">{row.employee}</span>
    },
    {
      name: 'Project',
      selector: row => row.project,
      sortable: true,
    },
    {
      name: 'Date',
      selector: row => row.date,
      sortable: true,
    },
    {
      name: 'Hours',
      selector: row => row.hours,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => <span className={`badge bg-${statusColor[row.status]} px-3 py-2`}>{row.status}</span>
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <button className="btn btn-sm btn-light rounded-circle me-2" title="Edit" onClick={() => handleEditTimesheet(row)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-sm btn-danger rounded-circle" title="Delete" onClick={() => handleDeleteTimesheet(row.id)}>
            <i className="fas fa-trash"></i>
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '110px',
    },
  ];

  // Filtered data for search
  const filteredTimesheets = timesheetList.filter(ts =>
    ts.employee.toLowerCase().includes(search.toLowerCase()) ||
    ts.project.toLowerCase().includes(search.toLowerCase()) ||
    ts.date.toLowerCase().includes(search.toLowerCase()) ||
    ts.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '1rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Timesheet Management ({timesheetList.length})</h4>
        <button className="btn btn-primary rounded-pill" onClick={handleAddTimesheet}>
          <i className="fas fa-plus me-2"></i>Add Timesheet
        </button>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search timesheets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>
      <div style={{ boxShadow: '0 6px 32px 0 #232b3e22', borderRadius: '1rem', width: '100%' }}>
        <DataTable
          columns={columns}
          data={filteredTimesheets}
          pagination
          highlightOnHover
          striped
          responsive
          persistTableHead
          noHeader
          customStyles={customStyles}
        />
      </div>

      {/* Timesheet Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editingTimesheet ? 'Edit Timesheet' : 'Add New Timesheet'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Employee</label>
                      <select
                        className={`form-select ${errors.employee ? 'is-invalid' : ''}`}
                        name="employee"
                        value={formData.employee}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                          <option key={emp} value={emp}>{emp}</option>
                        ))}
                      </select>
                      {errors.employee && <div className="invalid-feedback">{errors.employee}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Project</label>
                      <select
                        className={`form-select ${errors.project ? 'is-invalid' : ''}`}
                        name="project"
                        value={formData.project}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                          <option key={project} value={project}>{project}</option>
                        ))}
                      </select>
                      {errors.project && <div className="invalid-feedback">{errors.project}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Date</label>
                      <input
                        type="date"
                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                      />
                      {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Hours Worked</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        className={`form-control ${errors.hours ? 'is-invalid' : ''}`}
                        name="hours"
                        value={formData.hours}
                        onChange={handleInputChange}
                        placeholder="e.g., 8.5"
                      />
                      {errors.hours && <div className="invalid-feedback">{errors.hours}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingTimesheet ? 'Update Timesheet' : 'Add Timesheet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 