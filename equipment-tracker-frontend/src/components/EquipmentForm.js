import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './EquipmentForm.css';

const EquipmentForm = ({ 
  equipment, 
  onSubmit, 
  onCancel, 
  loading, 
  error 
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Populate form when editing existing equipment
  useEffect(() => {
    if (equipment) {
      const formData = {
        name: equipment.name,
        type: equipment.type,
        status: equipment.status,
        lastCleanedDate: equipment.lastCleanedDate 
          ? new Date(equipment.lastCleanedDate).toISOString().split('T')[0]
          : ''
      };
      reset(formData);
    } else {
      reset({
        name: '',
        type: '',
        status: '',
        lastCleanedDate: ''
      });
    }
  }, [equipment, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  const equipmentTypes = ['Machine', 'Vessel', 'Tank', 'Mixer'];
  const equipmentStatuses = ['Active', 'Inactive', 'Under Maintenance'];

  return (
    <div className="equipment-form-container">
      <h2>{equipment ? 'Edit Equipment' : 'Add New Equipment'}</h2>
      
      {error && (
        <div className="form-error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="equipment-form">
        <div className="form-group">
          <label htmlFor="name">Equipment Name *</label>
          <input
            id="name"
            type="text"
            {...register('name', { 
              required: 'Equipment name is required',
              maxLength: {
                value: 100,
                message: 'Equipment name must be 100 characters or less'
              }
            })}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && (
            <span className="field-error">{errors.name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="type">Equipment Type *</label>
          <select
            id="type"
            {...register('type', { required: 'Equipment type is required' })}
            className={errors.type ? 'error' : ''}
          >
            <option value="">Select equipment type</option>
            {equipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && (
            <span className="field-error">{errors.type.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status">Equipment Status *</label>
          <select
            id="status"
            {...register('status', { required: 'Equipment status is required' })}
            className={errors.status ? 'error' : ''}
          >
            <option value="">Select equipment status</option>
            {equipmentStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.status && (
            <span className="field-error">{errors.status.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastCleanedDate">Last Cleaned Date *</label>
          <input
            id="lastCleanedDate"
            type="date"
            {...register('lastCleanedDate', { 
              required: 'Last cleaned date is required' 
            })}
            className={errors.lastCleanedDate ? 'error' : ''}
          />
          {errors.lastCleanedDate && (
            <span className="field-error">{errors.lastCleanedDate.message}</span>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Saving...' : (equipment ? 'Update Equipment' : 'Add Equipment')}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            disabled={loading}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentForm;