import React, { useState } from 'react';

const profileData = {
  personal: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@logistics.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543'
  },
  employment: {
    employeeId: 'EMP001',
    department: 'Logistics',
    position: 'Senior Operations Manager',
    hireDate: '2020-03-15',
    manager: 'Sarah Wilson',
    workLocation: 'Main Warehouse',
    employmentType: 'Full-time'
  },
  documents: [
    { id: 1, name: 'Employment Contract', type: 'Contract', uploadDate: '2024-01-15', status: 'Active' },
    { id: 2, name: 'W-4 Form', type: 'Tax', uploadDate: '2024-01-15', status: 'Active' },
    { id: 3, name: 'Direct Deposit Form', type: 'Payroll', uploadDate: '2024-01-15', status: 'Active' },
    { id: 4, name: 'Safety Training Certificate', type: 'Training', uploadDate: '2024-02-01', status: 'Active' },
    { id: 5, name: 'Performance Review Q4 2024', type: 'Review', uploadDate: '2024-01-10', status: 'Active' }
  ],
  requests: [
    { id: 1, type: 'Leave Request', status: 'Approved', submittedDate: '2024-01-10', details: 'Annual leave for family vacation' },
    { id: 2, type: 'Equipment Request', status: 'Pending', submittedDate: '2024-01-12', details: 'New safety equipment needed' },
    { id: 3, type: 'Training Request', status: 'Approved', submittedDate: '2024-01-08', details: 'Advanced logistics certification course' },
    { id: 4, type: 'Schedule Change', status: 'Rejected', submittedDate: '2024-01-05', details: 'Request for flexible working hours' },
    { id: 5, type: 'Benefits Update', status: 'Pending', submittedDate: '2024-01-15', details: 'Update health insurance coverage' }
  ]
};

const requestTypes = [
  'Leave Request', 'Equipment Request', 'Training Request', 'Schedule Change', 
  'Benefits Update', 'Payroll Query', 'IT Support', 'Maintenance Request', 
  'Policy Question', 'Other'
];

const documentTypes = [
  'Contract', 'Tax', 'Payroll', 'Training', 'Review', 'Certificate', 
  'Policy', 'Handbook', 'Other'
];

export default function SelfServicePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(profileData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingSection, setEditingSection] = useState('');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleEditProfile = (section) => {
    setEditingSection(section);
    setFormData(profile[section]);
    setErrors({});
    setShowEditModal(true);
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setProfile(prev => ({
        ...prev,
        [editingSection]: { ...formData }
      }));
      setShowEditModal(false);
    }
  };

  const handleNewRequest = () => {
    setFormData({
      type: '',
      details: '',
      priority: 'Medium'
    });
    setErrors({});
    setShowRequestModal(true);
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (validateRequestForm()) {
      const newRequest = {
        id: Math.max(...profile.requests.map(r => r.id)) + 1,
        ...formData,
        status: 'Pending',
        submittedDate: new Date().toISOString().split('T')[0]
      };
      setProfile(prev => ({
        ...prev,
        requests: [...prev.requests, newRequest]
      }));
      setShowRequestModal(false);
    }
  };

  const handleUploadDocument = () => {
    setFormData({
      name: '',
      type: '',
      file: null
    });
    setErrors({});
    setShowUploadModal(true);
  };

  const handleSubmitDocument = (e) => {
    e.preventDefault();
    if (validateDocumentForm()) {
      const newDocument = {
        id: Math.max(...profile.documents.map(d => d.id)) + 1,
        name: formData.name,
        type: formData.type,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      setProfile(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument]
      }));
      setShowUploadModal(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRequestForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = 'Request type is required';
    if (!formData.details) newErrors.details = 'Request details are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDocumentForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Document name is required';
    if (!formData.type) newErrors.type = 'Document type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '1rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Self Service Portal</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={handleNewRequest}>
            <i className="fas fa-plus me-2"></i>New Request
          </button>
          <button className="btn btn-outline-success btn-sm" onClick={handleUploadDocument}>
            <i className="fas fa-upload me-2"></i>Upload Document
          </button>
        </div>
      </div>

      {/* Info Box for Self-Service Features */}
      <div className="alert alert-info d-flex align-items-center gap-3 mb-4 shadow-sm" style={{ borderRadius: '0.75rem', background: 'linear-gradient(90deg, #e3f2fd 0%, #f1f8e9 100%)', border: '1px solid #b3e5fc' }}>
        <i className="fas fa-info-circle fa-lg text-primary"></i>
        <div>
          <span className="fw-semibold">Self-Service Features:</span>
          <ul className="mb-0 ps-4">
            <li>Leave</li>
            <li>Payslip</li>
            <li>Document Access</li>
          </ul>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4" id="selfServiceTabs">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user me-2"></i>Profile
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <i className="fas fa-file-alt me-2"></i>Documents
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <i className="fas fa-clipboard-list me-2"></i>My Requests
          </button>
        </li>
      </ul>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">Personal Information</h6>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleEditProfile('personal')}
                >
                  <i className="fas fa-edit"></i>
                </button>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold">First Name</label>
                    <p className="mb-0">{profile.personal.firstName}</p>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">Last Name</label>
                    <p className="mb-0">{profile.personal.lastName}</p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Email</label>
                    <p className="mb-0">{profile.personal.email}</p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Phone</label>
                    <p className="mb-0">{profile.personal.phone}</p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Address</label>
                    <p className="mb-0">{profile.personal.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">Employment Information</h6>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handleEditProfile('employment')}
                >
                  <i className="fas fa-edit"></i>
                </button>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold">Employee ID</label>
                    <p className="mb-0">{profile.employment.employeeId}</p>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">Department</label>
                    <p className="mb-0">{profile.employment.department}</p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Position</label>
                    <p className="mb-0">{profile.employment.position}</p>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">Hire Date</label>
                    <p className="mb-0">{profile.employment.hireDate}</p>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">Manager</label>
                    <p className="mb-0">{profile.employment.manager}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {profile.documents.map(doc => (
                <tr key={doc.id}>
                  <td className="fw-semibold">{doc.name}</td>
                  <td><span className="badge bg-light text-dark">{doc.type}</span></td>
                  <td>{doc.uploadDate}</td>
                  <td><span className="badge bg-success">{doc.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" title="Download">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Request Type</th>
                <th>Details</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {profile.requests.map(request => (
                <tr key={request.id}>
                  <td className="fw-semibold">{request.type}</td>
                  <td>{request.details}</td>
                  <td>{request.submittedDate}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-info me-2" title="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                    {request.status === 'Pending' && (
                      <button className="btn btn-sm btn-outline-danger" title="Cancel">
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  Edit {editingSection.charAt(0).toUpperCase() + editingSection.slice(1)} Information
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleSubmitProfile}>
                <div className="modal-body">
                  <div className="row g-3">
                    {Object.keys(formData).map(key => (
                      <div key={key} className="col-12">
                        <label className="form-label fw-semibold">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                          name={key}
                          value={formData[key]}
                          onChange={handleInputChange}
                        />
                        {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showRequestModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Submit New Request</h5>
                <button type="button" className="btn-close" onClick={() => setShowRequestModal(false)}></button>
              </div>
              <form onSubmit={handleSubmitRequest}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Request Type</label>
                      <select
                        className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Request Type</option>
                        {requestTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Priority</label>
                      <select
                        className="form-select"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Details</label>
                      <textarea
                        className={`form-control ${errors.details ? 'is-invalid' : ''}`}
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Please provide detailed information about your request..."
                      ></textarea>
                      {errors.details && <div className="invalid-feedback">{errors.details}</div>}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowRequestModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Upload Document</h5>
                <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
              </div>
              <form onSubmit={handleSubmitDocument}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Document Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter document name"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Document Type</label>
                      <select
                        className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Document Type</option>
                        {documentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">File</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files[0] }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Upload Document
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