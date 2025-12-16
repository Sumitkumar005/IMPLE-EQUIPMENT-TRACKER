const Joi = require('joi');
const { EQUIPMENT_TYPES, EQUIPMENT_STATUS } = require('../models/Equipment');

// Equipment validation schema
const equipmentSchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.empty': 'Equipment name is required',
      'string.max': 'Equipment name cannot exceed 100 characters',
      'any.required': 'Equipment name is required'
    }),
  
  type: Joi.string()
    .valid(...EQUIPMENT_TYPES)
    .required()
    .messages({
      'any.only': `Equipment type must be one of: ${EQUIPMENT_TYPES.join(', ')}`,
      'any.required': 'Equipment type is required'
    }),
  
  status: Joi.string()
    .valid(...EQUIPMENT_STATUS)
    .required()
    .messages({
      'any.only': `Equipment status must be one of: ${EQUIPMENT_STATUS.join(', ')}`,
      'any.required': 'Equipment status is required'
    }),
  
  lastCleanedDate: Joi.date()
    .iso()
    .required()
    .messages({
      'date.format': 'Last cleaned date must be a valid ISO date',
      'any.required': 'Last cleaned date is required'
    })
});

// Equipment update schema (allows partial updates)
const equipmentUpdateSchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(100)
    .messages({
      'string.empty': 'Equipment name cannot be empty',
      'string.max': 'Equipment name cannot exceed 100 characters'
    }),
  
  type: Joi.string()
    .valid(...EQUIPMENT_TYPES)
    .messages({
      'any.only': `Equipment type must be one of: ${EQUIPMENT_TYPES.join(', ')}`
    }),
  
  status: Joi.string()
    .valid(...EQUIPMENT_STATUS)
    .messages({
      'any.only': `Equipment status must be one of: ${EQUIPMENT_STATUS.join(', ')}`
    }),
  
  lastCleanedDate: Joi.date()
    .iso()
    .messages({
      'date.format': 'Last cleaned date must be a valid ISO date'
    })
}).min(1); // At least one field must be provided for update

// Validation middleware factory
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: validationErrors
        }
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

module.exports = {
  validateEquipment: validateRequest(equipmentSchema),
  validateEquipmentUpdate: validateRequest(equipmentUpdateSchema)
};