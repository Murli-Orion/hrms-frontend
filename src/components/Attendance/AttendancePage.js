import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../AuthContext';
import { fetchFromApi } from '../../api';

const statusColor = {
  'Present': 'success',
  'Late': 'warning',
  'Absent': 'danger',
  'Half Day': 'info',
};

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

const TABS = ['Attendance Log', 'Calendar', 'Attendance Requests'];
const holidays = [
  { date: '2024-07-04', name: 'Independence Day' },
  { date: '2024-08-15', name: 'Assumption Day' },
];
const birthdays = [
  { date: '2024-07-10', name: 'Priya Singh' },
  { date: '2024-07-15', name: 'Ravi Kumar' },
];
const joiningDates = [
  { date: '2024-07-01', name: 'Amit Sharma' },
];

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AttendancePage() {
  const { user, isHR, isAdmin } = useAuth();
  const [attendanceList, setAttendanceList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(TABS[0]);
  const [showModal, setShowModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [formData, setFormData] = useState({
    employee: '', date: '', checkIn: '', checkOut: '', status: 'Present', punchType: 'Biometric', geofencing: '', overtime: 0
  });
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');
  const [geoLocation, setGeoLocation] = useState('');
  const [theme, setTheme] = useState('light');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employeeFilter, setEmployeeFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchFromApi('employees'),
      fetchFromApi('attendance')
    ])
      .then(([empData, attData]) => {
        setEmployees(empData.users || empData);
        setAttendanceList(Array.isArray(attData) ? attData : attData.users);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filtered data for role
  const userFullName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '';
  const filteredAttendance = (isHR || isAdmin)
    ? (employeeFilter ? attendanceList.filter(a => a.employee === employeeFilter) : attendanceList)
    : attendanceList.filter(a => a.employee === userFullName);

  // Prepare events for big calendar (must be before any return/if)
  const calendarEvents = useMemo(() => {
    let events = [];
    // Attendance events
    filteredAttendance.forEach(a => {
      events.push({
        title: `${a.employee} - ${a.status}`,
        start: new Date(a.date + 'T' + (a.checkIn || '09:00')),
        end: new Date(a.date + 'T' + (a.checkOut || '18:00')),
        allDay: false,
        type: 'attendance',
        status: a.status,
        employee: a.employee,
      });
    });
    // Holidays
    holidays.forEach(h => {
      events.push({
        title: `Holiday: ${h.name}`,
        start: new Date(h.date),
        end: new Date(h.date),
        allDay: true,
        type: 'holiday',
      });
    });
    // Birthdays
    birthdays.forEach(b => {
      events.push({
        title: `Birthday: ${b.name}`,
        start: new Date(b.date),
        end: new Date(b.date),
        allDay: true,
        type: 'birthday',
      });
    });
    // Joining Dates
    joiningDates.forEach(j => {
      events.push({
        title: `Joining: ${j.name}`,
        start: new Date(j.date),
        end: new Date(j.date),
        allDay: true,
        type: 'joining',
      });
    });
    return events;
  }, [filteredAttendance]);

  if (loading) return <div>Loading attendance data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // --- Timings & Actions Data (static for now) ---
  const today = new Date().toISOString().split('T')[0];
  const myToday = attendanceList.find(a => a.employee === userFullName && a.date === today);
  const avgHours = '7h 2m';
  const onTime = '40%';
  const myTeamAvg = '4h 3m';
  const myTeamOnTime = '18%';
  const todayDuration = myToday ? '8h 30m' : '--';
  const effective = '5h 33m';
  const gross = '5h 33m';
  const lastLogin = '5h 33m';

  // --- Calendar Data (static for now) ---
  const calendarDays = Array.from({ length: 35 }, (_, i) => i - 1); // 0=Mon, 34=Sun

  // Employee filter for HR/Admin
  const employeeOptions = Array.from(new Set(attendanceList.map(a => a.employee)));

  // Event style getter
  function eventStyleGetter(event) {
    if (event.type === 'attendance') {
      if (event.status === 'Late') return { style: { backgroundColor: 'orange' } };
      if (event.status === 'Present') return { style: { backgroundColor: 'green' } };
      if (event.status === 'Absent') return { style: { backgroundColor: 'red' } };
      return { style: { backgroundColor: 'gray' } };
    }
    if (event.type === 'holiday') return { style: { backgroundColor: '#d9534f' } };
    if (event.type === 'birthday') return { style: { backgroundColor: '#0275d8' } };
    if (event.type === 'joining') return { style: { backgroundColor: '#6f42c1' } };
    return { style: { backgroundColor: 'gray' } };
  }

  const handleAddAttendance = () => {
    setEditingAttendance(null);
    setFormData({
      employee: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '',
      checkOut: '',
      status: 'Present',
      punchType: 'Biometric',
      geofencing: geoLocation,
      overtime: 0
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditAttendance = (attendance) => {
    setEditingAttendance(attendance);
    setFormData({
      employee: attendance.employee,
      date: attendance.date,
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut,
      status: attendance.status,
      punchType: attendance.punchType || 'Biometric',
      geofencing: attendance.geofencing || '',
      overtime: attendance.overtime || 0
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDeleteAttendance = (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      setAttendanceList(prev => prev.filter(att => att.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee) newErrors.employee = 'Employee is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.checkIn) newErrors.checkIn = 'Check-in time is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out time is required';
    
    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (formData.checkIn && !timeRegex.test(formData.checkIn)) {
      newErrors.checkIn = 'Invalid time format (HH:MM)';
    }
    if (formData.checkOut && !timeRegex.test(formData.checkOut)) {
      newErrors.checkOut = 'Invalid time format (HH:MM)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingAttendance) {
      // Update existing attendance
      setAttendanceList(prev => prev.map(att => 
        att.id === editingAttendance.id 
          ? { ...att, ...formData }
          : att
      ));
    } else {
      // Add new attendance
      const newAttendance = {
        id: Math.max(...attendanceList.map(att => att.id)) + 1,
        ...formData,
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`
      };
      setAttendanceList(prev => [...prev, newAttendance]);
    }
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'overtime' ? Number(value) : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // --- Attendance Log Visual Table ---
  function getAttendanceVisual(hours) {
    // Simulate a bar: width proportional to hours (max 10h)
    const width = Math.min(100, (hours / 10) * 100);
    return (
      <div style={{ background: '#e5eaf5', borderRadius: 6, height: 8, width: 120, position: 'relative' }}>
        <div style={{ background: '#06b6d4', height: 8, borderRadius: 6, width: `${width}%` }}></div>
      </div>
    );
  }

  function getStatusBadge(status) {
    if (status === 'REG') return <span className="badge bg-info">REG</span>;
    if (status === 'W-OFF') return <span className="badge bg-secondary">W-OFF</span>;
    if (status === 'PENALTY') return <span className="badge bg-danger">PENALTY</span>;
    return null;
  }

  function getArrivalStatus(arrival) {
    if (arrival > 0) return <span><i className="fa fa-exclamation-circle text-warning me-1"></i>{arrival}m late</span>;
    if (arrival === 0) return <span><i className="fa fa-check-circle text-success me-1"></i>On Time</span>;
    return <span className="text-muted">--</span>;
  }

  // Simulate attendance log data from dummyjson users
  const attendanceLog = attendanceList.slice(0, 10).map((u, i) => {
    // Simulate: every 7th day is W-OFF, every 5th is REG, every 3rd is PENALTY
    let status = 'REG';
    if (i % 7 === 0) status = 'W-OFF';
    else if (i % 5 === 0) status = 'PENALTY';
    // Simulate hours and arrival
    const hours = 8 + (i % 3) * 0.5;
    const arrival = i % 4 === 0 ? 0 : (i % 4) * 10; // 0=on time, else late in min
    // Simulate date
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      id: u.id,
      date: date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' }),
      status,
      hours,
      arrival,
      name: `${u.firstName} ${u.lastName}`,
      location: u.address?.city || 'N/A',
    };
  });

  return (
    <div className={`attendance-dashboard theme-${theme}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Attendance</h2>
        <button className="btn btn-outline-secondary" onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
      </div>
      {(isHR || isAdmin) && (
        <div className="mb-3">
          <label className="me-2">Filter by Employee:</label>
          <select value={employeeFilter} onChange={e => setEmployeeFilter(e.target.value)}>
            <option value="">All</option>
            {employeeOptions.map(emp => <option key={emp} value={emp}>{emp}</option>)}
          </select>
        </div>
      )}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div className="fw-bold">AVG HRS / DAY</div>
                <div>{avgHours}</div>
              </div>
              <div>
                <div className="fw-bold">ON TIME ARRIVAL</div>
                <div>{onTime}</div>
              </div>
              <div>
                <div className="fw-bold">My Team</div>
                <div>{myTeamAvg} / {myTeamOnTime}</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="fw-bold">Today ({myToday ? `${myToday.checkIn} - ${myToday.checkOut}` : '--'})</div>
              <div>Duration: {todayDuration}</div>
              <div className="progress mt-2" style={{ height: 8 }}>
                <div className="progress-bar bg-info" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold" style={{ fontSize: 24 }}>{new Date().toLocaleTimeString()}</div>
                <div>{new Date().toLocaleDateString()}</div>
              </div>
              <button className="btn btn-danger">Web Clock-out</button>
            </div>
            <div className="mt-2">
              <div>Total Hours</div>
              <div>Effective: {effective}</div>
              <div>Gross: {gross}</div>
              <div className="small text-muted">{lastLogin} Since Last Login</div>
              <a href="#" className="small">Attendance Policy</a>
            </div>
          </div>
        </div>
      </div>
      <div className="card p-3 mb-4">
        <div className="d-flex gap-3 mb-3">
          {TABS.map(t => (
            <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        {tab === 'Attendance Log' && (
          <div className="card p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-bold fs-5">Last 30 Days</div>
              <div className="text-muted">Showing {attendanceLog.length} records</div>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Attendance Visual</th>
                    <th>Gross Hours</th>
                    <th>Arrival</th>
                    <th>Log</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLog.length === 0 && (
                    <tr><td colSpan="7" className="text-center text-muted">No attendance records found.</td></tr>
                  )}
                  {attendanceLog.map(row => (
                    <tr key={row.id} className={row.status === 'W-OFF' ? 'table-secondary' : ''}>
                      <td>{row.date}</td>
                      <td>{row.name}</td>
                      <td>{getAttendanceVisual(row.hours)}</td>
                      <td>{row.hours}h</td>
                      <td>{getArrivalStatus(row.arrival)}</td>
                      <td>{getStatusBadge(row.status)}</td>
                      <td><i className="fa fa-map-marker-alt text-info me-1"></i>{row.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === 'Calendar' && (
          <div className="calendar-view">
            <BigCalendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              eventPropGetter={eventStyleGetter}
              popup
              views={['month', 'week', 'day']}
              tooltipAccessor={event => event.title}
            />
            <div className="mt-3 small">
              <span style={{ background: 'green', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>Present</span> &nbsp;
              <span style={{ background: 'orange', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>Late</span> &nbsp;
              <span style={{ background: '#d9534f', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>Holiday</span> &nbsp;
              <span style={{ background: '#0275d8', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>Birthday</span> &nbsp;
              <span style={{ background: '#6f42c1', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>Joining</span>
            </div>
          </div>
        )}
        {tab === 'Attendance Requests' && (
          <div className="alert alert-info">No attendance requests (static demo).</div>
        )}
      </div>

      {/* Attendance Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editingAttendance ? 'Edit Attendance' : 'Add New Attendance'}
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
                      <label className="form-label fw-semibold">Check In Time</label>
                      <input
                        type="time"
                        className={`form-control ${errors.checkIn ? 'is-invalid' : ''}`}
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleInputChange}
                      />
                      {errors.checkIn && <div className="invalid-feedback">{errors.checkIn}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Check Out Time</label>
                      <input
                        type="time"
                        className={`form-control ${errors.checkOut ? 'is-invalid' : ''}`}
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleInputChange}
                      />
                      {errors.checkOut && <div className="invalid-feedback">{errors.checkOut}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Absent">Absent</option>
                        <option value="Half Day">Half Day</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Punch Type</label>
                      <select
                        className="form-select"
                        name="punchType"
                        value={formData.punchType}
                        onChange={handleInputChange}
                      >
                        <option value="Biometric">Biometric</option>
                        <option value="Web">Web</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Overtime (hrs)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="overtime"
                        value={formData.overtime}
                        min="0"
                        step="0.1"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Geofencing (Location)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="geofencing"
                        value={formData.geofencing}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAttendance ? 'Update Attendance' : 'Add Attendance'}
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