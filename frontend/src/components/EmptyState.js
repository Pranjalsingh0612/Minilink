import React from 'react';

const EmptyState = ({ icon = '📭', message = 'No data available' }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
