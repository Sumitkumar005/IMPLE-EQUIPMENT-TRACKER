import React from 'react';
import './EquipmentList.css';

const EquipmentList = ({ 
  equipment, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onRetry 
}) => {
  if (loading) {
    return (
      <div className="equipment-list-container">
        <div className="loading-message">Loading equipment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="equipment-list-container">
        <div className="error-message">
          <p>Error loading equipment: {error}</p>
          <button onClick={onRetry} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!equipment || !Array.isArray(equipment) || equipment.length === 0) {
    return (
      <div className="equipment-list-container">
        <div className="empty-message">
          No equipment available. Add some equipment to get started.
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="equipment-list-container">
      <table className="equipment-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Last Cleaned Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.status}</td>
              <td>{formatDate(item.lastCleanedDate)}</td>
              <td>
                <button 
                  onClick={() => onEdit(item)} 
                  className="edit-button"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(item)} 
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentList;