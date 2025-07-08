import React, { useEffect, useState } from 'react';
import { fetchFromApi } from '../../api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFromApi('notifications')
      .then(data => setNotifications(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const markAsUnread = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
  };
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Notifications</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 && (
              <tr><td colSpan="5" className="text-center">No notifications found.</td></tr>
            )}
            {notifications.map(n => (
              <tr key={n.id} className={n.read ? 'table-light' : 'table-warning'}>
                <td>{n.title || 'Notification'}</td>
                <td>{n.message || n.body || ''}</td>
                <td>
                  <span className={`badge bg-${n.read ? 'secondary' : 'warning'}`}>{n.read ? 'Read' : 'Unread'}</span>
                </td>
                <td>{n.date || n.createdAt || 'N/A'}</td>
                <td>
                  {n.read ? (
                    <button className="btn btn-sm btn-outline-info me-2" onClick={() => markAsUnread(n.id)}>Mark Unread</button>
                  ) : (
                    <button className="btn btn-sm btn-success me-2" onClick={() => markAsRead(n.id)}>Mark Read</button>
                  )}
                  <button className="btn btn-sm btn-danger" onClick={() => deleteNotification(n.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 