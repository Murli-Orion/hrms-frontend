import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { fetchFromApi } from '../api';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user ? { ...user } : {});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [documents, setDocuments] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Dynamic custom fields configuration
  const [dynamicFields] = useState([
    { id: 'emergency_contact', label: 'Emergency Contact', type: 'text', required: false },
    { id: 'emergency_phone', label: 'Emergency Phone', type: 'tel', required: false },
    { id: 'blood_type', label: 'Blood Type', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: false },
    { id: 'allergies', label: 'Allergies', type: 'textarea', required: false },
    { id: 'skills', label: 'Skills', type: 'tags', required: false },
    { id: 'certifications', label: 'Certifications', type: 'textarea', required: false },
    { id: 'languages', label: 'Languages', type: 'tags', required: false },
    { id: 'preferred_shift', label: 'Preferred Shift', type: 'select', options: ['Morning', 'Afternoon', 'Night', 'Flexible'], required: false }
  ]);

  useEffect(() => {
    if (user) {
      setForm({ ...user });
      loadDocuments();
      loadCustomFields();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      // Simulate loading documents
      const mockDocuments = [
        { id: 1, name: 'Resume.pdf', type: 'pdf', size: '245 KB', uploadedAt: '2024-01-15', category: 'Employment' },
        { id: 2, name: 'ID_Document.jpg', type: 'image', size: '1.2 MB', uploadedAt: '2024-01-10', category: 'Identity' },
        { id: 3, name: 'Contract_2024.pdf', type: 'pdf', size: '890 KB', uploadedAt: '2024-01-05', category: 'Employment' },
        { id: 4, name: 'Medical_Certificate.pdf', type: 'pdf', size: '156 KB', uploadedAt: '2024-01-02', category: 'Medical' }
      ];
      setDocuments(mockDocuments);
    } catch (err) {
      console.error('Error loading documents:', err);
    }
  };

  const loadCustomFields = async () => {
    try {
      // Simulate loading custom fields data
      const mockCustomFields = {
        emergency_contact: 'John Doe',
        emergency_phone: '+1-555-0123',
        blood_type: 'O+',
        allergies: 'None',
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        certifications: 'AWS Certified Developer, Google Cloud Professional',
        languages: ['English', 'Spanish', 'French'],
        preferred_shift: 'Morning'
      };
      setCustomFields(mockCustomFields);
    } catch (err) {
      console.error('Error loading custom fields:', err);
    }
  };

  if (!user) return (
    <div className="container py-4">
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    </div>
  );

  const handleEdit = () => {
    setEditMode(true);
    setForm({ ...user });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setError('');
    setSuccess('');
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCustomFieldChange = (fieldId, value) => {
    setCustomFields(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(user.id, form);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDocument = {
        id: Date.now(),
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        category: 'Other'
      };
      
      setDocuments(prev => [newDocument, ...prev]);
      setSuccess('Document uploaded successfully!');
    } catch (err) {
      setError('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = (documentId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    setSuccess('Document deleted successfully!');
  };

  const renderField = (field) => {
    const value = customFields[field.id] || '';
    
    switch (field.type) {
      case 'select':
        return (
          <select 
            className="form-select"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            disabled={!editMode}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea 
            className="form-control"
            rows="3"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            disabled={!editMode}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          ></textarea>
        );
      case 'tags':
        return (
          <input 
            type="text" 
            className="form-control"
            value={Array.isArray(value) ? value.join(', ') : value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value.split(',').map(tag => tag.trim()))}
            disabled={!editMode}
            placeholder={`Enter ${field.label.toLowerCase()} (comma separated)`}
          />
        );
      default:
        return (
          <input 
            type={field.type} 
            className="form-control"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            disabled={!editMode}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  const getDocumentIcon = (type) => {
    return type === 'pdf' ? 'fas fa-file-pdf text-danger' : 'fas fa-file-image text-primary';
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">My Profile</h2>
              <p className="text-muted mb-0">Manage your personal information and documents</p>
            </div>
            {!editMode && (
              <button className="btn btn-primary" onClick={handleEdit}>
                <i className="fas fa-edit me-2"></i>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        {/* Profile Overview Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className="position-relative d-inline-block mb-3">
                <img 
                  src={user.image} 
                  alt="avatar" 
                  className="rounded-circle" 
                  width={120} 
                  height={120}
                  style={{ objectFit: 'cover' }}
                />
                {editMode && (
                  <button className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle">
                    <i className="fas fa-camera"></i>
                  </button>
                )}
              </div>
              <h4 className="fw-bold mb-1">{user.firstName} {user.lastName}</h4>
              <div className="text-muted mb-2">{user.email}</div>
              <div className="mb-2">
                <i className="fas fa-phone me-2"></i>
                {user.phone}
              </div>
              <div className="mb-3">
                <i className="fas fa-map-marker-alt me-2"></i>
                {user.address?.address}, {user.address?.city}
              </div>
              
              {/* Quick Stats */}
              <div className="row text-center">
                <div className="col-4">
                  <div className="fw-bold text-primary">{documents.length}</div>
                  <small className="text-muted">Documents</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-success">Active</div>
                  <small className="text-muted">Status</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-info">2</div>
                  <small className="text-muted">Years</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="fas fa-user me-2"></i>
                    Basic Info
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'custom' ? 'active' : ''}`}
                    onClick={() => setActiveTab('custom')}
                  >
                    <i className="fas fa-cog me-2"></i>
                    Custom Fields
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
                    onClick={() => setActiveTab('documents')}
                  >
                    <i className="fas fa-file-alt me-2"></i>
                    Documents
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {/* Basic Info Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input 
                          className="form-control" 
                          name="firstName" 
                          value={form.firstName || ''} 
                          onChange={handleChange} 
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input 
                          className="form-control" 
                          name="lastName" 
                          value={form.lastName || ''} 
                          onChange={handleChange} 
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input 
                          className="form-control" 
                          name="email" 
                          type="email"
                          value={form.email || ''} 
                          onChange={handleChange} 
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input 
                          className="form-control" 
                          name="phone" 
                          value={form.phone || ''} 
                          onChange={handleChange} 
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input 
                          className="form-control" 
                          name="address" 
                          value={form.address?.address || ''} 
                          onChange={e => setForm(f => ({ ...f, address: { ...f.address, address: e.target.value } }))} 
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">City</label>
                        <input 
                          className="form-control" 
                          name="city" 
                          value={form.address?.city || ''} 
                          onChange={e => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))} 
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  </div>
                  {editMode && (
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-success" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        type="button" 
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              )}

              {/* Custom Fields Tab */}
              {activeTab === 'custom' && (
                <div>
                  <div className="row">
                    {dynamicFields.map(field => (
                      <div key={field.id} className="col-md-6 mb-3">
                        <label className="form-label">
                          {field.label}
                          {field.required && <span className="text-danger">*</span>}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                  {editMode && (
                    <div className="d-flex gap-2">
                      <button className="btn btn-success">
                        <i className="fas fa-save me-2"></i>
                        Save Custom Fields
                      </button>
                      <button className="btn btn-secondary" onClick={handleCancel}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">My Documents</h5>
                    <div>
                      <input
                        type="file"
                        id="file-upload"
                        className="d-none"
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="file-upload" className="btn btn-primary">
                        {uploading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-upload me-2"></i>
                            Upload Document
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {documents.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                      <h5>No documents uploaded</h5>
                      <p className="text-muted">Upload your first document to get started</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Document</th>
                            <th>Category</th>
                            <th>Size</th>
                            <th>Uploaded</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documents.map(doc => (
                            <tr key={doc.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <i className={`${getDocumentIcon(doc.type)} me-2`}></i>
                                  <span className="fw-medium">{doc.name}</span>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark">{doc.category}</span>
                              </td>
                              <td>{doc.size}</td>
                              <td>{doc.uploadedAt}</td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button className="btn btn-outline-primary">
                                    <i className="fas fa-download"></i>
                                  </button>
                                  <button 
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDeleteDocument(doc.id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 