import React, { useState, useEffect } from 'react';
import { fetchFromApi } from '../api';

export default function NotificationEnginePage() {
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('notifications');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all',
    scheduledFor: '',
    template: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notifData, templateData] = await Promise.all([
        fetchFromApi('notifications'),
        fetchFromApi('posts') // Using posts as templates
      ]);
      
      setNotifications(notifData || []);
      setTemplates(templateData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      const newNotif = {
        id: Date.now(),
        ...newNotification,
        createdAt: new Date().toISOString(),
        read: false,
        status: 'pending'
      };
      setNotifications(prev => [newNotif, ...prev]);
      setShowCreateModal(false);
      setNewNotification({ title: '', message: '', type: 'info', recipients: 'all', scheduledFor: '', template: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    const icons = {
      info: 'fa-info-circle text-info',
      success: 'fa-check-circle text-success',
      warning: 'fa-exclamation-triangle text-warning',
      error: 'fa-times-circle text-danger'
    };
    return icons[type] || icons.info;
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
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Notification Engine</h2>
              <p className="text-muted mb-0">Manage notifications, templates, and scheduling</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fas fa-plus me-2"></i>
              Create Notification
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Notifications</h6>
                  <h3 className="mb-0">{notifications.length}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-bell fa-2x opacity-75"></i>
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
                  <h6 className="card-title">Read</h6>
                  <h3 className="mb-0">{notifications.filter(n => n.read).length}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-check-circle fa-2x opacity-75"></i>
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
                  <h6 className="card-title">Unread</h6>
                  <h3 className="mb-0">{notifications.filter(n => !n.read).length}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-envelope fa-2x opacity-75"></i>
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
                  <h6 className="card-title">Templates</h6>
                  <h3 className="mb-0">{templates.length}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-file-alt fa-2x opacity-75"></i>
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
                className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <i className="fas fa-bell me-2"></i>
                Notifications
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'templates' ? 'active' : ''}`}
                onClick={() => setActiveTab('templates')}
              >
                <i className="fas fa-file-alt me-2"></i>
                Templates
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'scheduled' ? 'active' : ''}`}
                onClick={() => setActiveTab('scheduled')}
              >
                <i className="fas fa-clock me-2"></i>
                Scheduled
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'notifications' && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Recent Notifications</h5>
              </div>
              <div className="card-body p-0">
                {notifications.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-bell fa-3x text-muted mb-3"></i>
                    <h5>No notifications yet</h5>
                    <p className="text-muted">Create your first notification to get started</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`list-group-item ${!notification.read ? 'bg-light' : ''}`}>
                        <div className="d-flex align-items-start">
                          <div className="flex-shrink-0 me-3">
                            <i className={`fas ${getNotificationIcon(notification.type)} fa-lg`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">{notification.title || 'Notification'}</h6>
                                <p className="mb-1 text-muted">{notification.message || notification.body || ''}</p>
                                <small className="text-muted">
                                  <i className="fas fa-clock me-1"></i>
                                  {new Date(notification.createdAt || notification.date).toLocaleString()}
                                </small>
                              </div>
                              <div className="d-flex gap-2">
                                {!notification.read && (
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                )}
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Notification Templates</h5>
                <button className="btn btn-sm btn-primary">
                  <i className="fas fa-plus me-1"></i>
                  New Template
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  {templates.slice(0, 6).map(template => (
                    <div key={template.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card h-100 border">
                        <div className="card-body">
                          <h6 className="card-title">{template.title}</h6>
                          <p className="card-text text-muted small">
                            {template.body?.substring(0, 100)}...
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              ID: {template.id}
                            </small>
                            <button className="btn btn-sm btn-outline-primary">
                              Use Template
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scheduled' && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Scheduled Notifications</h5>
              </div>
              <div className="card-body text-center py-5">
                <i className="fas fa-clock fa-3x text-muted mb-3"></i>
                <h5>No scheduled notifications</h5>
                <p className="text-muted">Schedule notifications for future delivery</p>
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Schedule Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Notification</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateNotification}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={newNotification.title}
                          onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Type</label>
                        <select 
                          className="form-select"
                          value={newNotification.type}
                          onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
                        >
                          <option value="info">Info</option>
                          <option value="success">Success</option>
                          <option value="warning">Warning</option>
                          <option value="error">Error</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea 
                      className="form-control" 
                      rows="4"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Recipients</label>
                        <select 
                          className="form-select"
                          value={newNotification.recipients}
                          onChange={(e) => setNewNotification(prev => ({ ...prev, recipients: e.target.value }))}
                        >
                          <option value="all">All Employees</option>
                          <option value="managers">Managers Only</option>
                          <option value="hr">HR Team</option>
                          <option value="specific">Specific Users</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Schedule For (Optional)</label>
                        <input 
                          type="datetime-local" 
                          className="form-control"
                          value={newNotification.scheduledFor}
                          onChange={(e) => setNewNotification(prev => ({ ...prev, scheduledFor: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-paper-plane me-2"></i>
                    Send Notification
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showCreateModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
} 