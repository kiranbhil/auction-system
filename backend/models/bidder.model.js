const mongoose = require("mongoose");

const bidderSchema = new mongoose.Schema({
    bidder_id: { type: String, unique: true },
    bidder_name: { type: String },
    bid_value: { type: Number },
    bid_time: { type: Date, default: Date.now }
  });

const Bidder = mongoose.model('Bidder', bidderSchema);
module.exports = Bidder;