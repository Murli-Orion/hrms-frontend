import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const employees = [
  { id: 1, name: 'John Doe', department: 'Warehouse', role: 'Supervisor', email: 'john.doe@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 2, name: 'Jane Smith', department: 'Transport', role: 'Driver', email: 'jane.smith@logisticsco.com', status: 'On Leave', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 3, name: 'Carlos Ruiz', department: 'Operations', role: 'Manager', email: 'carlos.ruiz@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 4, name: 'Emily Zhang', department: 'Customer Service', role: 'Agent', email: 'emily.zhang@logisticsco.com', status: 'Inactive', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 5, name: 'Michael Johnson', department: 'IT', role: 'Developer', email: 'michael.johnson@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { id: 6, name: 'Sarah Wilson', department: 'HR', role: 'Coordinator', email: 'sarah.wilson@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
  { id: 7, name: 'David Brown', department: 'Finance', role: 'Accountant', email: 'david.brown@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/55.jpg' },
  { id: 8, name: 'Lisa Anderson', department: 'Marketing', role: 'Specialist', email: 'lisa.anderson@logisticsco.com', status: 'On Leave', avatar: 'https://randomuser.me/api/portraits/women/66.jpg' },
  { id: 9, name: 'Robert Taylor', department: 'Warehouse', role: 'Forklift Operator', email: 'robert.taylor@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/77.jpg' },
  { id: 10, name: 'Amanda Garcia', department: 'Transport', role: 'Dispatcher', email: 'amanda.garcia@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/88.jpg' },
  { id: 11, name: 'James Martinez', department: 'Operations', role: 'Coordinator', email: 'james.martinez@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/99.jpg' },
  { id: 12, name: 'Jennifer Lee', department: 'Customer Service', role: 'Team Lead', email: 'jennifer.lee@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/11.jpg' },
  { id: 13, name: 'Christopher White', department: 'IT', role: 'System Admin', email: 'christopher.white@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
  { id: 14, name: 'Michelle Rodriguez', department: 'HR', role: 'Manager', email: 'michelle.rodriguez@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/13.jpg' },
  { id: 15, name: 'Daniel Thompson', department: 'Finance', role: 'Analyst', email: 'daniel.thompson@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/14.jpg' },
  { id: 16, name: 'Nicole Clark', department: 'Marketing', role: 'Manager', email: 'nicole.clark@logisticsco.com', status: 'On Leave', avatar: 'https://randomuser.me/api/portraits/women/15.jpg' },
  { id: 17, name: 'Kevin Lewis', department: 'Warehouse', role: 'Picker', email: 'kevin.lewis@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/16.jpg' },
  { id: 18, name: 'Stephanie Hall', department: 'Transport', role: 'Driver', email: 'stephanie.hall@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/17.jpg' },
  { id: 19, name: 'Andrew Young', department: 'Operations', role: 'Supervisor', email: 'andrew.young@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/18.jpg' },
  { id: 20, name: 'Rachel King', department: 'Customer Service', role: 'Agent', email: 'rachel.king@logisticsco.com', status: 'Inactive', avatar: 'https://randomuser.me/api/portraits/women/19.jpg' },
  { id: 21, name: 'Thomas Wright', department: 'IT', role: 'Support Specialist', email: 'thomas.wright@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/20.jpg' },
  { id: 22, name: 'Jessica Lopez', department: 'HR', role: 'Recruiter', email: 'jessica.lopez@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/21.jpg' },
  { id: 23, name: 'Ryan Hill', department: 'Finance', role: 'Controller', email: 'ryan.hill@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/23.jpg' },
  { id: 24, name: 'Ashley Scott', department: 'Marketing', role: 'Coordinator', email: 'ashley.scott@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/24.jpg' },
  { id: 25, name: 'Brandon Green', department: 'Warehouse', role: 'Manager', email: 'brandon.green@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/25.jpg' },
  { id: 26, name: 'Megan Adams', department: 'Transport', role: 'Fleet Manager', email: 'megan.adams@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/26.jpg' },
  { id: 27, name: 'Justin Baker', department: 'Operations', role: 'Director', email: 'justin.baker@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/27.jpg' },
  { id: 28, name: 'Lauren Nelson', department: 'Customer Service', role: 'Manager', email: 'lauren.nelson@logisticsco.com', status: 'On Leave', avatar: 'https://randomuser.me/api/portraits/women/28.jpg' },
  { id: 29, name: 'Tyler Carter', department: 'IT', role: 'Network Engineer', email: 'tyler.carter@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/men/29.jpg' },
  { id: 30, name: 'Hannah Mitchell', department: 'HR', role: 'Benefits Specialist', email: 'hannah.mitchell@logisticsco.com', status: 'Active', avatar: 'https://randomuser.me/api/portraits/women/30.jpg' },
];

const statusColor = {
  'Active': 'success',
  'On Leave': 'warning',
  'Inactive': 'secondary',
};

const departments = ['Warehouse', 'Transport', 'Operations', 'Customer Service', 'IT', 'HR', 'Finance', 'Marketing'];
const roles = ['Manager', 'Supervisor', 'Coordinator', 'Specialist', 'Agent', 'Driver', 'Developer', 'Accountant', 'Recruiter', 'Forklift Operator', 'Picker', 'Dispatcher', 'Team Lead', 'System Admin', 'Analyst', 'Controller', 'Fleet Manager', 'Director', 'Support Specialist', 'Network Engineer', 'Benefits Specialist'];

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

export default function EmployeeList() {
  const [employeeList, setEmployeeList] = useState(employees);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    role: '',
    email: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [profileEmployee, setProfileEmployee] = useState(null);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      department: '',
      role: '',
      email: '',
      status: 'Active'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      department: employee.department,
      role: employee.role,
      email: employee.email,
      status: employee.status
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployeeList(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingEmployee) {
      // Update existing employee
      setEmployeeList(prev => prev.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...formData }
          : emp
      ));
    } else {
      // Add new employee
      const newEmployee = {
        id: Math.max(...employeeList.map(emp => emp.id)) + 1,
        ...formData,
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`
      };
      setEmployeeList(prev => [...prev, newEmployee]);
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
      cell: row => (
        <img
          src={row.avatar}
          alt={row.name}
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => {
            setProfileEmployee(row);
            setShowProfile(true);
          }}
        />
      ),
      width: '70px',
      sortable: false,
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      cell: row => <span className="fw-semibold">{row.name}</span>
    },
    {
      name: 'Department',
      selector: row => row.department,
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => row.role,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
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
          <button className="btn btn-sm btn-light rounded-circle me-2" title="Edit" onClick={() => handleEditEmployee(row)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-sm btn-danger rounded-circle" title="Delete" onClick={() => handleDeleteEmployee(row.id)}>
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
  const filteredEmployees = employeeList.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase()) ||
    emp.role.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '1rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Employee List ({employeeList.length})</h4>
          <button className="btn btn-primary rounded-pill" onClick={handleAddEmployee}>
            <i className="fas fa-user-plus me-2"></i>Add Employee
          </button>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search employees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 320 }}
          />
        </div>
        <div style={{ boxShadow: '0 6px 32px 0 #232b3e22', borderRadius: '1rem', width: '100%' }}>
          <DataTable
            columns={columns}
            data={filteredEmployees}
            pagination
            highlightOnHover
            striped
            responsive
            persistTableHead
            noHeader
            customStyles={customStyles}
          />
        </div>
      </div>

      {/* Employee Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Full Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Department</label>
                      <select
                        className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dep => (
                          <option key={dep} value={dep}>{dep}</option>
                        ))}
                      </select>
                      {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Role</label>
                      <select
                        className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingEmployee ? 'Update Employee' : 'Add Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <Modal show={showProfile} onHide={() => setShowProfile(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Employee Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profileEmployee && (
            <div className="text-center">
              <img src={profileEmployee.avatar} alt={profileEmployee.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }} />
              <h5>{profileEmployee.name}</h5>
              <p><strong>Department:</strong> {profileEmployee.department}</p>
              <p><strong>Role:</strong> {profileEmployee.role}</p>
              <p><strong>Email:</strong> {profileEmployee.email}</p>
              <p><strong>Status:</strong> {profileEmployee.status}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfile(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
} 