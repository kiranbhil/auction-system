const express = require("express");
const Bidder = require("../models/bidder.model");
const bidRoute = express.Router();

// Handle bid placement API request
bidRoute.post('/place', (req, res) => {
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
        io.emit('newBid', bidder);
        res.send(bidder);
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      });
  });
  

  bidRoute.get('/leaderboard', (req, res) => {
    Bidder.find({})
      .sort({ bid_value: -1 })
      .limit(5)
      .then(bidders => {
        res.send(bidders);
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      });
  });
  
  