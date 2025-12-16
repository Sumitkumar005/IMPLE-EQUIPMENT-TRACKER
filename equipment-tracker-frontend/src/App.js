import React, { useState, useEffect } from 'react';
import EquipmentList from './components/EquipmentList';
import EquipmentForm from './components/EquipmentForm';
import { equipmentAPI } from './services/api';
import './App.css';

function App() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Load equipment on component mount
  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await equipmentAPI.getAll();
      setEquipment(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load equipment');
      setEquipment([]); // Ensure equipment is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setFormError(null);
    setCurrentView('form');
  };

  const handleEditEquipment = (equipmentItem) => {
    setEditingEquipment(equipmentItem);
    setFormError(null);
    setCurrentView('form');
  };

  const handleDeleteEquipment = (equipmentItem) => {
    setDeleteConfirmation(equipmentItem);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    
    setLoading(true);
    try {
      await equipmentAPI.delete(deleteConfirmation._id);
      await loadEquipment(); // Reload the list
      setDeleteConfirmation(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to delete equipment');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      if (editingEquipment) {
        await equipmentAPI.update(editingEquipment._id, formData);
      } else {
        await equipmentAPI.create(formData);
      }
      
      await loadEquipment(); // Reload the list
      setCurrentView('list');
      setEditingEquipment(null);
    } catch (err) {
      setFormError(err.response?.data?.error?.message || err.message || 'Failed to save equipment');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setCurrentView('list');
    setEditingEquipment(null);
    setFormError(null);
  };

  const handleRetry = () => {
    loadEquipment();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Equipment Tracker</h1>
        {currentView === 'list' && (
          <button onClick={handleAddEquipment} className="add-button">
            Add New Equipment
          </button>
        )}
      </header>

      <main className="App-main">
        {currentView === 'list' ? (
          <EquipmentList
            equipment={equipment}
            loading={loading}
            error={error}
            onEdit={handleEditEquipment}
            onDelete={handleDeleteEquipment}
            onRetry={handleRetry}
          />
        ) : (
          <EquipmentForm
            equipment={editingEquipment}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
            error={formError}
          />
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete "{deleteConfirmation.name}"? 
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="confirm-delete-button">
                Delete
              </button>
              <button onClick={cancelDelete} className="cancel-delete-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
