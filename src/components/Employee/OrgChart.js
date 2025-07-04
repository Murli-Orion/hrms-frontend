import React, { useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Sample org data
const orgData = {
  id: 1,
  name: 'Alice Johnson',
  title: 'CEO',
  department: 'Executive',
  children: [
    {
      id: 2,
      name: 'Bob Smith',
      title: 'Head of Engineering',
      department: 'Engineering',
      children: [
        {
          id: 3,
          name: 'Carol White',
          title: 'Lead Developer',
          department: 'Engineering',
          children: [
            {
              id: 4,
              name: 'David Brown',
              title: 'Developer',
              department: 'Engineering',
            },
          ],
        },
      ],
    },
    {
      id: 5,
      name: 'Eve Black',
      title: 'Head of HR',
      department: 'Human Resources',
      children: [
        {
          id: 6,
          name: 'Frank Green',
          title: 'HR Specialist',
          department: 'Human Resources',
        },
      ],
    },
  ],
};

const OrgNode = ({ node }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <TreeNode
      label={
        <Card
          className="text-center shadow-sm mb-2"
          style={{ minWidth: 180, cursor: hasChildren ? 'pointer' : 'default', background: '#f8f9fa' }}
        >
          <Card.Body style={{ padding: '0.5rem' }}>
            <div style={{ fontWeight: 'bold' }}>{node.name}</div>
            <div style={{ fontSize: '0.9em', color: '#555' }}>{node.title}</div>
            <div style={{ fontSize: '0.8em', color: '#888' }}>{node.department}</div>
            {hasChildren && (
              <Button
                size="sm"
                variant="outline-primary"
                style={{ marginTop: 4 }}
                onClick={e => {
                  e.stopPropagation();
                  setExpanded(x => !x);
                }}
              >
                {expanded ? 'Collapse' : 'Expand'}
              </Button>
            )}
          </Card.Body>
        </Card>
      }
    >
      {hasChildren && expanded &&
        node.children.map(child => (
          <OrgNode key={child.id} node={child} />
        ))}
    </TreeNode>
  );
};

const OrgChart = () => {
  return (
    <div className="mb-4">
      <Card className="shadow-sm">
        <Card.Header as="h5">Organization Chart</Card.Header>
        <Card.Body style={{ overflowX: 'auto' }}>
          <Tree
            lineWidth={'2px'}
            lineColor={'#007bff'}
            lineBorderRadius={'8px'}
            label={<span />}
          >
            <OrgNode node={orgData} />
          </Tree>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrgChart; 