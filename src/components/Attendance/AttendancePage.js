import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../AuthContext';

const attendanceData = [
  { id: 1, employee: 'John Doe', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', punchType: 'Biometric', geofencing: 'New York, US', overtime: 1.5 },
  { id: 2, employee: 'Jane Smith', date: '2024-01-15', checkIn: '08:45', checkOut: '17:15', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', punchType: 'Web', geofencing: 'London, UK', overtime: 0 },
  { id: 3, employee: 'Carlos Ruiz', date: '2024-01-15', checkIn: '09:00', checkOut: '18:00', status: 'Late', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', punchType: 'Biometric', geofencing: 'Madrid, ES', overtime: 2 },
  { id: 4, employee: 'Emily Zhang', date: '2024-01-15', checkIn: '08:15', checkOut: '17:45', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', punchType: 'Biometric', geofencing: 'Beijing, CN', overtime: 1 },
  { id: 5, employee: 'Michael Johnson', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', punchType: 'Web', geofencing: 'Tokyo, JP', overtime: 0.5 },
  { id: 6, employee: 'Sarah Wilson', date: '2024-01-15', checkIn: '08:20', checkOut: '17:20', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', punchType: 'Biometric', geofencing: 'Mumbai, IN', overtime: 1 },
  { id: 7, employee: 'David Brown', date: '2024-01-15', checkIn: '08:40', checkOut: '17:40', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', punchType: 'Web', geofencing: 'São Paulo, BR', overtime: 0.5 },
  { id: 8, employee: 'Lisa Anderson', date: '2024-01-15', checkIn: '09:15', checkOut: '18:15', status: 'Late', avatar: 'https://randomuser.me/api/portraits/women/66.jpg', punchType: 'Biometric', geofencing: 'Cape Town, ZA', overtime: 2 },
  { id: 9, employee: 'Robert Taylor', date: '2024-01-15', checkIn: '08:25', checkOut: '17:25', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/77.jpg', punchType: 'Web', geofencing: 'Berlin, DE', overtime: 0.5 },
  { id: 10, employee: 'Amanda Garcia', date: '2024-01-15', checkIn: '08:35', checkOut: '17:35', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/88.jpg', punchType: 'Biometric', geofencing: 'Paris, FR', overtime: 1 },
  { id: 11, employee: 'James Martinez', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/99.jpg', punchType: 'Web', geofencing: 'Sydney, AU', overtime: 0.5 },
  { id: 12, employee: 'Jennifer Lee', date: '2024-01-15', checkIn: '08:50', checkOut: '17:50', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/11.jpg', punchType: 'Biometric', geofencing: 'Toronto, CA', overtime: 1 },
  { id: 13, employee: 'Christopher White', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/12.jpg', punchType: 'Web', geofencing: 'Dubai, AE', overtime: 0.5 },
  { id: 14, employee: 'Michelle Rodriguez', date: '2024-01-15', checkIn: '08:20', checkOut: '17:20', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/13.jpg', punchType: 'Biometric', geofencing: 'Moscow, RU', overtime: 1 },
  { id: 15, employee: 'Daniel Thompson', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/14.jpg', punchType: 'Web', geofencing: 'Mexico City, MX', overtime: 0.5 },
  { id: 16, employee: 'Nicole Clark', date: '2024-01-15', checkIn: '09:30', checkOut: '18:30', status: 'Late', avatar: 'https://randomuser.me/api/portraits/women/15.jpg', punchType: 'Biometric', geofencing: 'Rio de Janeiro, BR', overtime: 2 },
  { id: 17, employee: 'Kevin Lewis', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/16.jpg', punchType: 'Web', geofencing: 'Cairo, EG', overtime: 0.5 },
  { id: 18, employee: 'Stephanie Hall', date: '2024-01-15', checkIn: '08:25', checkOut: '17:25', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', punchType: 'Biometric', geofencing: 'Istanbul, TR', overtime: 1 },
  { id: 19, employee: 'Andrew Young', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/18.jpg', punchType: 'Web', geofencing: 'Jakarta, ID', overtime: 0.5 },
  { id: 20, employee: 'Rachel King', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/19.jpg', punchType: 'Biometric', geofencing: 'Seoul, KR', overtime: 1 },
  { id: 21, employee: 'Thomas Wright', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/20.jpg', punchType: 'Web', geofencing: 'Bangkok, TH', overtime: 0.5 },
  { id: 22, employee: 'Jessica Lopez', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/21.jpg', punchType: 'Biometric', geofencing: 'Manila, PH', overtime: 1 },
  { id: 23, employee: 'Ryan Hill', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/23.jpg', punchType: 'Web', geofencing: 'Singapore, SG', overtime: 0.5 },
  { id: 24, employee: 'Ashley Scott', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/24.jpg', punchType: 'Biometric', geofencing: 'Hong Kong, HK', overtime: 1 },
  { id: 25, employee: 'Brandon Green', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/25.jpg', punchType: 'Web', geofencing: 'Taipei, TW', overtime: 0.5 },
  { id: 26, employee: 'Megan Adams', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/26.jpg', punchType: 'Biometric', geofencing: 'Osaka, JP', overtime: 1 },
  { id: 27, employee: 'Justin Baker', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/27.jpg', punchType: 'Web', geofencing: 'Shanghai, CN', overtime: 0.5 },
  { id: 28, employee: 'Lauren Nelson', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/28.jpg', punchType: 'Biometric', geofencing: 'Beijing, CN', overtime: 1 },
  { id: 29, employee: 'Tyler Carter', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/men/29.jpg', punchType: 'Web', geofencing: 'Mumbai, IN', overtime: 0.5 },
  { id: 30, employee: 'Hannah Mitchell', date: '2024-01-15', checkIn: '08:30', checkOut: '17:30', status: 'Present', avatar: 'https://randomuser.me/api/portraits/women/30.jpg', punchType: 'Biometric', geofencing: 'Delhi, IN', overtime: 1 },
];

const statusColor = {
  'Present': 'success',
  'Late': 'warning',
  'Absent': 'danger',
  'Half Day': 'info',
};

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

function getTodayAttendance(attendanceList, user) {
  // For demo, just pick the first record for the logged-in user
  return attendanceList.find(a => a.employee === user.name && a.date === new Date().toISOString().split('T')[0]);
}

export default function AttendancePage() {
  const { user, isHR, isAdmin } = useAuth();
  const [attendanceList, setAttendanceList] = useState(attendanceData);
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
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city && data.country_code) setGeoLocation(`${data.city}, ${data.country_code}`);
        else if (data && data.country_name) setGeoLocation(data.country_name);
        else setGeoLocation('Unknown');
      })
      .catch(() => setGeoLocation('Unknown'));
  }, []);

  // --- Timings & Actions Data (static for now) ---
  const today = new Date().toISOString().split('T')[0];
  const myToday = attendanceList.find(a => a.employee === user.name && a.date === today);
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

  // Filtered data for role
  const filteredAttendance = (isHR || isAdmin)
    ? (employeeFilter ? attendanceList.filter(a => a.employee === employeeFilter) : attendanceList)
    : attendanceList.filter(a => a.employee === user.name);

  // Prepare events for big calendar
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
          <DataTable
            columns={[
              { name: 'Date', selector: row => row.date },
              { name: 'Check In', selector: row => row.checkIn },
              { name: 'Check Out', selector: row => row.checkOut },
              { name: 'Status', selector: row => row.status },
              { name: 'Punch Type', selector: row => row.punchType },
              { name: 'Geofencing', selector: row => row.geofencing },
              { name: 'Overtime', selector: row => row.overtime },
            ]}
            data={filteredAttendance}
            customStyles={customStyles}
            pagination
          />
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