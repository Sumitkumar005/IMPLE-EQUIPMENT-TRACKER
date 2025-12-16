const mongoose = require('mongoose');
const { Equipment } = require('../models/Equipment');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
const getAllEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: equipment,
      count: equipment.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Public
const createEquipment = async (req, res, next) => {
  try {
    const equipment = new Equipment(req.body);
    const savedEquipment = await equipment.save();
    
    res.status(201).json({
      success: true,
      data: savedEquipment,
      message: 'Equipment created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Public
const updateEquipment = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Public
const deleteEquipment = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment
};