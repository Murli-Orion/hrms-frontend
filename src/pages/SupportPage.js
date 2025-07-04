import React, { useState } from 'react';

export default function SupportPage() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };
  return (
    <div>
      <h2>Support & Feedback</h2>
      <p>Contact support@hrms.com or submit feedback below.</p>
      <form onSubmit={handleSubmit} className="mb-3">
        <textarea className="form-control mb-2" rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Your feedback..." required />
        <button className="btn btn-primary" type="submit">Submit Feedback</button>
      </form>
      {submitted && <div className="alert alert-success">Thank you for your feedback!</div>}
    </div>
  );
} 