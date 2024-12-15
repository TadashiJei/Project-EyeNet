const router = require('express').Router();
const reportController = require('../controllers/reportController');

// Create a new report
router.route('/').post(reportController.createReport);

// Get all reports
router.route('/').get(reportController.getAllReports);

// Get a specific report by ID
router.route('/:id').get(reportController.getReport);

// Delete a report by ID
router.route('/:id').delete(reportController.deleteReport);

module.exports = router;
