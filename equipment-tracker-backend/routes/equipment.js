const express = require('express');
const mongoose = require('mongoose');
const { Equipment } = require('../models/Equipment');
const { validateEquipment, validateEquipmentUpdate } = require('../middleware/validation');
const { AppError, catchAsync } = require('../middleware/errorHandler');

const router = express.Router();

// GET /api/equipment - Retrieve all equipment records
router.get('/', catchAsync(async (req, res) => {
  const equipment = await Equipment.find().sort({ createdAt: -1 });
  
  res.json({
    success: true,
    data: equipment,
    count: equipment.length
  });
}));

// POST /api/equipment - Create new equipment record
router.post('/', validateEquipment, catchAsync(async (req, res) => {
  const equipment = new Equipment(req.body);
  const savedEquipment = await equipment.save();
  
  res.status(201).json({
    success: true,
    data: savedEquipment,
    message: 'Equipment created successfully'
  });
}));

// PUT /api/equipment/:id - Update existing equipment record
router.put('/:id', validateEquipmentUpdate, catchAsync(async (req, res) => {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError('Invalid equipment ID format', 400, 'INVALID_ID');
  }

  const equipment = await Equipment.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: new Date() },
    { 
      new: true, // Return updated document
      runValidators: true // Run schema validation
    }
  );

  if (!equipment) {
    throw new AppError('Equipment record not found', 404, 'NOT_FOUND');
  }

  res.json({
    success: true,
    data: equipment,
    message: 'Equipment updated successfully'
  });
}));

// DELETE /api/equipment/:id - Delete equipment record
router.delete('/:id', catchAsync(async (req, res) => {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError('Invalid equipment ID format', 400, 'INVALID_ID');
  }

  const equipment = await Equipment.findByIdAndDelete(req.params.id);

  if (!equipment) {
    throw new AppError('Equipment record not found', 404, 'NOT_FOUND');
  }

  res.json({
    success: true,
    data: equipment,
    message: 'Equipment deleted successfully'
  });
}));

module.exports = router;