const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['Performance', 'Network Usage', 'IP']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  generatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
