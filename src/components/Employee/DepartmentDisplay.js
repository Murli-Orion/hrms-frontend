import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

// Uses Bootstrap Card and ListGroup
const departments = [
  'Human Resources',
  'Finance',
  'Engineering',
  'Sales',
  'Marketing',
  'Customer Support',
  'IT',
  'Operations',
];

const DepartmentDisplay = () => (
  <Card className="mb-4 shadow-sm">
    <Card.Header as="h5">Departments</Card.Header>
    <ListGroup variant="flush">
      {departments.map((dept, idx) => (
        <ListGroup.Item key={idx}>{dept}</ListGroup.Item>
      ))}
    </ListGroup>
  </Card>
);

export default DepartmentDisplay; 