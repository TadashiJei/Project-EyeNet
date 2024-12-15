const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ipSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department'
  },
  usage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const IP = mongoose.model('IP', ipSchema);

module.exports = IP;
