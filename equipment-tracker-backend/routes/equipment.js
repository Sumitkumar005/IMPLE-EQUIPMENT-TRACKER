const express = require('express');
const { validateEquipment, validateEquipmentUpdate } = require('../middleware/validation');
const { catchAsync } = require('../middleware/errorHandler');
const {
  getAllEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment
} = require('../controllers/equipmentController');

const router = express.Router();

// Equipment routes
router.get('/', catchAsync(getAllEquipment));
router.post('/', validateEquipment, catchAsync(createEquipment));
router.put('/:id', validateEquipmentUpdate, catchAsync(updateEquipment));
router.delete('/:id', catchAsync(deleteEquipment));

module.exports = router;