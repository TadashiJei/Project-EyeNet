const Report = require('../models/report.model');

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const newReport = new Report({
      type: req.body.type,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      data: req.body.data,
      generatedBy: req.body.generatedBy
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific report by ID
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a report by ID
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
