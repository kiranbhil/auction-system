const express = require("express")
const mongoose = require('mongoose');
require('dotenv').config();
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = 8000
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
app.use(express.json());
app.use(cors())
// const io = socketI(server);

// Set up MongoDB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;

// Set up MongoDB schema for bidders
const bidderSchema = new mongoose.Schema({
  bidder_id: { type: String, unique: true },
  bidder_name: { type: String, unique: true },
  bid_value: { type: Number },
  bid_time: { type: Date, default: Date.now }
});
const Bidder = mongoose.model('Bidder', bidderSchema);

// Handle bid placement API request
app.post('/bids', (req, res) => {
  const bidder_id = req.body.bidder_id;
  const bidder_name = req.body.bidder_name;
  const bid_value = req.body.bid_value;

  const newBidder = new Bidder({
    bidder_id: bidder_id,
    bidder_name: bidder_name,
    bid_value: bid_value
  });

  newBidder.save()
    .then(bidder => {
      // Send real-time update of new bid
      socketIO.emit('newBid', bidder);
      res.send(bidder);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});

// Handle leaderboard API request
app.get('/leaderboard', (req, res) => {
  Bidder.find({})
    .sort({ bid_value: 1 })
    .limit(5)
    .then(bidders => {
      res.send(bidders);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});

// Handle MongoDB connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

