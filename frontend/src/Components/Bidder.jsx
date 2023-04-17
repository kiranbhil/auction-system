import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
import socketIO from "socket.io-client"
import style from "./Bidder.module.css";


const Bidder = () => {
//   const socket = io('http://localhost:8000');
    const socket = socketIO.connect("http://localhost:8000")
    // const [bibberId, setBidderId] = useState('')
    const [bidderName, setBidderName] = useState('');
    const [bidValue, setBidValue] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    const validate = values => {
        const errors = {}
        if (!values.name) {
          errors.name = 'Required'
        }
        if (!values.bidamt) {
          errors.bidamt = 'Required'
        }
        return errors
      }
      
    useEffect(() => {
    // Receive real-time update of new bid
    socket.on('newBid', (bidder) => {
      setLeaderboard(prevLeaderboard => {
        // Check if bidder already exists in leaderboard
        const bidderIndex = prevLeaderboard.findIndex((b) => b.bidder_id === bidder.bidder_id);
        if (bidderIndex > -1) {
          // Update existing bidder's bid value
          prevLeaderboard[bidderIndex].bid_value = bidder.bid_value;
          return [...prevLeaderboard];
        } else {
          // Add new bidder to leaderboard
          return [bidder, ...prevLeaderboard.slice(0, 4)];
        }
      });
    });

    // Retrieve leaderboard on initial load
    fetch('http://localhost:8000/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data);
      })
      .catch(err => console.log(err));

  }, []);

//   console.log(leaderboard)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Send bid placement API request
    fetch('http://localhost:8000/bids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bidder_id: socket.id,
        bidder_name: bidderName,
        bid_value: bidValue
      })
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));

    setBidderName('');
    setBidValue('');

    fetch('http://localhost:8000/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data);
      })
      .catch(err => console.log(err));


  };

  const handleNameChange = (e) => {
    setBidderName(e.target.value);
  };

  const handleBidChange = (e) => {
    setBidValue(e.target.value);
  };

  return (
    <div>
        <Box bg='teal' textAlign={'center'} textColor={'black'} w='100%' p={4} color='white'>
            <Text fontSize='30px' fontWeight={'bold'} color='blackAlpha.900'>Auction System</Text> 
        </Box>
        <br />
        <div className={style.Box} >
        <Text textAlign={"center"} fontSize={"xl"} fontWeight="bold">Place Bid</Text>  
        <form onSubmit={handleSubmit}>
            <label>
            Name:
            <input type="text" value={bidderName} onChange={handleNameChange} required />
            </label>
            <label>
            Bid Amount:
            <input type="number" value={bidValue} onChange={handleBidChange} required />
            </label>
            <button className={style.Btn} type="submit">Place Bid</button>
        </form>
        </div>
      <br />    
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((bidder) => (
          <li key={bidder.bidder_id}>
            {bidder.bidder_name}: {bidder.bid_value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bidder;
