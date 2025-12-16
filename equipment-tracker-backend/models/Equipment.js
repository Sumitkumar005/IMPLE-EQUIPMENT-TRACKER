const mongoose = require('mongoose');

// Equipment type enum
const EQUIPMENT_TYPES = ['Machine', 'Vessel', 'Tank', 'Mixer'];

// Equipment status enum
const EQUIPMENT_STATUS = ['Active', 'Inactive', 'Under Maintenance'];

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true,
    maxLength: [100, 'Equipment name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Equipment type is required'],
    enum: {
      values: EQUIPMENT_TYPES,
      message: 'Equipment type must be one of: {VALUES}'
    }
  },
  status: {
    type: String,
    required: [true, 'Equipment status is required'],
    enum: {
      values: EQUIPMENT_STATUS,
      message: 'Equipment status must be one of: {VALUES}'
    }
  },
  lastCleanedDate: {
    type: Date,
    required: [true, 'Last cleaned date is required']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the model and enums
const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = {
  Equipment,
  EQUIPMENT_TYPES,
  EQUIPMENT_STATUS
};