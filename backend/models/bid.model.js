const mongoose = require("mongoose");

// Define the bid schema
const bidSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
  });
  
  
  // Create the bid model
const Bid = mongoose.model('Bid', bidSchema);
  
module.exports = Bid;