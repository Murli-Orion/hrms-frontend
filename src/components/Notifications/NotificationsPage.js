import React, { useState } from 'react';

const notificationsData = [
  { id: 1, title: 'Payroll Processed', message: 'Payroll for December 2024 has been processed successfully.', type: 'success', time: '2 hours ago', read: false, category: 'payroll' },
  { id: 2, title: 'Leave Request Approved', message: 'Your leave request for January 15-17 has been approved.', type: 'info', time: '4 hours ago', read: false, category: 'leave' },
  { id: 3, title: 'Performance Review Due', message: 'Your quarterly performance review is due next week.', type: 'warning', time: '1 day ago', read: true, category: 'performance' },
  { id: 4, title: 'System Maintenance', message: 'Scheduled maintenance will occur tonight from 10 PM to 2 AM.', type: 'info', time: '1 day ago', read: true, category: 'system' },
  { id: 5, title: 'New Employee Onboarded', message: 'Welcome Sarah Wilson to the Logistics team!', type: 'success', time: '2 days ago', read: true, category: 'employee' },
  { id: 6, title: 'Timesheet Reminder', message: 'Please submit your timesheet for the current week.', type: 'warning', time: '2 days ago', read: false, category: 'timesheet' },
  { id: 7, title: 'Training Session', message: 'New safety training session scheduled for next Monday.', type: 'info', time: '3 days ago', read: true, category: 'training' },
  { id: 8, title: 'Overtime Approved', message: 'Your overtime request for last week has been approved.', type: 'success', time: '3 days ago', read: false, category: 'payroll' },
  { id: 9, title: 'Equipment Update', message: 'New delivery tracking devices have been installed.', type: 'info', time: '4 days ago', read: true, category: 'system' },
  { id: 10, title: 'Team Meeting', message: 'Monthly team meeting rescheduled to Friday at 2 PM.', type: 'warning', time: '4 days ago', read: true, category: 'meeting' },
  { id: 11, title: 'Benefits Update', message: 'New health insurance options available for enrollment.', type: 'info', time: '5 days ago', read: false, category: 'benefits' },
  { id: 12, title: 'Attendance Alert', message: 'You have been marked late for 3 consecutive days.', type: 'danger', time: '5 days ago', read: false, category: 'attendance' },
  { id: 13, title: 'Project Deadline', message: 'Warehouse optimization project deadline extended by 1 week.', type: 'warning', time: '6 days ago', read: true, category: 'project' },
  { id: 14, title: 'Equipment Maintenance', message: 'Forklift maintenance completed successfully.', type: 'success', time: '6 days ago', read: true, category: 'maintenance' },
  { id: 15, title: 'Policy Update', message: 'Updated company policy on remote work arrangements.', type: 'info', time: '1 week ago', read: true, category: 'policy' },
  { id: 16, title: 'Birthday Celebration', message: 'Happy Birthday to Carlos Ruiz!', type: 'success', time: '1 week ago', read: false, category: 'celebration' },
  { id: 17, title: 'Security Alert', message: 'Please update your password for security purposes.', type: 'danger', time: '1 week ago', read: false, category: 'security' },
  { id: 18, title: 'Inventory Update', message: 'Monthly inventory count completed successfully.', type: 'success', time: '1 week ago', read: true, category: 'inventory' },
  { id: 19, title: 'Weather Alert', message: 'Severe weather expected tomorrow - delivery routes may be affected.', type: 'warning', time: '1 week ago', read: true, category: 'weather' },
  { id: 20, title: 'Software Update', message: 'HRMS system will be updated to version 2.1 next week.', type: 'info', time: '1 week ago', read: true, category: 'system' },
  { id: 21, title: 'Employee Recognition', message: 'Congratulations to Emily Zhang for Employee of the Month!', type: 'success', time: '2 weeks ago', read: true, category: 'recognition' },
  { id: 22, title: 'Training Completion', message: 'You have successfully completed the new safety training module.', type: 'success', time: '2 weeks ago', read: true, category: 'training' },
  { id: 23, title: 'Budget Approval', message: 'Q1 2025 budget has been approved by management.', type: 'info', time: '2 weeks ago', read: true, category: 'finance' },
  { id: 24, title: 'Equipment Request', message: 'Your request for new safety equipment has been approved.', type: 'success', time: '2 weeks ago', read: false, category: 'equipment' },
  { id: 25, title: 'Schedule Change', message: 'Your work schedule has been updated for next month.', type: 'warning', time: '2 weeks ago', read: true, category: 'schedule' },
  { id: 26, title: 'Performance Bonus', message: 'You have earned a performance bonus for Q4 2024!', type: 'success', time: '3 weeks ago', read: true, category: 'payroll' },
  { id: 27, title: 'Team Building Event', message: 'Annual team building event scheduled for next month.', type: 'info', time: '3 weeks ago', read: true, category: 'event' },
  { id: 28, title: 'Policy Reminder', message: 'Please review the updated dress code policy.', type: 'warning', time: '3 weeks ago', read: true, category: 'policy' },
  { id: 29, title: 'System Backup', message: 'Scheduled system backup completed successfully.', type: 'success', time: '3 weeks ago', read: true, category: 'system' },
  { id: 30, title: 'Emergency Contact', message: 'Please update your emergency contact information.', type: 'warning', time: '3 weeks ago', read: false, category: 'personal' },
  { id: 31, title: 'Low Hours Alert', message: 'You have logged less than 30 hours this week. Please ensure your timesheet is up to date.', type: 'warning', time: '1 hour ago', read: false, category: 'alert' },
  { id: 32, title: 'Attendance Anomaly Detected', message: 'An anomaly was detected in your attendance records for this week. Please contact HR.', type: 'danger', time: '30 minutes ago', read: false, category: 'anomaly' },
];

const typeIcons = {
  success: 'fas fa-check-circle',
  info: 'fas fa-info-circle',
  warning: 'fas fa-exclamation-triangle',
  danger: 'fas fa-times-circle'
};

const typeColors = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger'
};

const categories = [
  'all', 'payroll', 'leave', 'performance', 'system', 'employee', 'timesheet', 
  'training', 'meeting', 'benefits', 'attendance', 'project', 'maintenance', 
  'policy', 'celebration', 'security', 'inventory', 'weather', 'recognition', 
  'finance', 'equipment', 'schedule', 'event', 'personal', 'alert', 'anomaly'
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState('all');
  const [showRead, setShowRead] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Filter by category
    if (filter !== 'all') {
      filtered = filtered.filter(notification => notification.category === filter);
    }

    // Filter by read status
    if (!showRead) {
      filtered = filtered.filter(notification => !notification.read);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }
  };

  const deleteAllRead = () => {
    if (window.confirm('Are you sure you want to delete all read notifications?')) {
      setNotifications(prev => prev.filter(notification => !notification.read));
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  const getCategoryCount = (category) => {
    if (category === 'all') return notifications.length;
    return notifications.filter(notification => notification.category === category).length;
  };

  const getUnreadCategoryCount = (category) => {
    if (category === 'all') return getUnreadCount();
    return notifications.filter(notification => 
      notification.category === category && !notification.read
    ).length;
  };

  return (
    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '1rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Notifications ({getUnreadCount()} unread)</h4>
          <p className="text-muted mb-0">Stay updated with important announcements and updates</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm" 
            onClick={markAllAsRead}
            disabled={getUnreadCount() === 0}
          >
            <i className="fas fa-check-double me-2"></i>Mark All Read
          </button>
          <button 
            className="btn btn-outline-danger btn-sm" 
            onClick={deleteAllRead}
            disabled={notifications.filter(n => n.read).length === 0}
          >
            <i className="fas fa-trash me-2"></i>Delete Read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Category</label>
          <select 
            className="form-select" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)} ({getCategoryCount(category)})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Search</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Show Read</label>
          <div className="form-check form-switch mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={showRead}
              onChange={(e) => setShowRead(e.target.checked)}
            />
            <label className="form-check-label">
              {showRead ? 'Showing all' : 'Unread only'}
            </label>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {getFilteredNotifications().length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No notifications found</h5>
            <p className="text-muted">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          getFilteredNotifications().map(notification => (
            <div 
              key={notification.id} 
              className={`card border-0 shadow-sm mb-3 ${!notification.read ? 'border-start border-primary border-4' : ''}`}
              style={{ borderRadius: '0.75rem' }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-start flex-grow-1">
                    <div className={`text-${typeColors[notification.type]} me-3 mt-1`}>
                      <i className={`${typeIcons[notification.type]} fa-lg`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className={`fw-bold mb-1 ${!notification.read ? 'text-primary' : ''}`}>
                          {notification.title}
                        </h6>
                        <div className="d-flex gap-1">
                          {!notification.read ? (
                            <button 
                              className="btn btn-sm btn-outline-primary rounded-circle"
                              onClick={() => markAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          ) : (
                            <button 
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              onClick={() => markAsUnread(notification.id)}
                              title="Mark as unread"
                            >
                              <i className="fas fa-eye-slash"></i>
                            </button>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-danger rounded-circle"
                            onClick={() => deleteNotification(notification.id)}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-muted mb-2">{notification.message}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-light text-dark">{notification.category}</span>
                        <small className="text-muted">{notification.time}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="row g-3 mt-4">
        <div className="col-md-3">
          <div className="card border-0 bg-primary bg-opacity-10">
            <div className="card-body text-center">
              <h5 className="text-primary fw-bold">{getUnreadCount()}</h5>
              <p className="text-muted mb-0">Unread</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-success bg-opacity-10">
            <div className="card-body text-center">
              <h5 className="text-success fw-bold">{notifications.filter(n => n.type === 'success').length}</h5>
              <p className="text-muted mb-0">Success</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-warning bg-opacity-10">
            <div className="card-body text-center">
              <h5 className="text-warning fw-bold">{notifications.filter(n => n.type === 'warning').length}</h5>
              <p className="text-muted mb-0">Warnings</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-danger bg-opacity-10">
            <div className="card-body text-center">
              <h5 className="text-danger fw-bold">{notifications.filter(n => n.type === 'danger').length}</h5>
              <p className="text-muted mb-0">Alerts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 