const router = require('express').Router();
const departmentController = require('../controllers/departmentController');

// Create a new department
router.route('/').post(departmentController.createDepartment);

// Get all departments
router.route('/').get(departmentController.getAllDepartments);

// Get a specific department by ID
router.route('/:id').get(departmentController.getDepartment);

// Update a department by ID
router.route('/:id').patch(departmentController.updateDepartment);

// Delete a department by ID
router.route('/:id').delete(departmentController.deleteDepartment);

module.exports = router;
