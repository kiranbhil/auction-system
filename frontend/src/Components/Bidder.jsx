import { Box, Divider, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
import socketIO from "socket.io-client"
import style from "./Bidder.module.css";
import moment from "moment";


const Bidder = () => {
//   const socket = io('http://localhost:8000');
    const socket = socketIO.connect("https://auction-backend-m6f2.onrender.com")
    // const [bibberId, setBidderId] = useState('')
    const [bidderName, setBidderName] = useState('');
    const [bidValue, setBidValue] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);
    
      
    useEffect(() => {
    // Receive real-time update of new bid
    socket.on('newBid', (bidder) => {
      setLeaderboard(prevLeaderboard => {
        // Check if bidder already exists in leaderboard
        const bidderIndex = prevLeaderboard.findIndex((b) => b.bidder_id === bidder.bidder_id);
        if (bidderIndex > -1) {
          prevLeaderboard[bidderIndex].bid_value = bidder.bid_value;
          return [...prevLeaderboard];
        } else {
          // Add new bidder to leaderboard
          return [bidder, ...prevLeaderboard.slice(0, 4)];
        }
      });
    });

    // Retrieve leaderboard on initial load
    fetch('https://auction-backend-m6f2.onrender.com/leaderboard')
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
    fetch('https://auction-backend-m6f2.onrender.com/bids', {
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

    fetch('https://auction-backend-m6f2.onrender.com/leaderboard')
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
        <Text  textAlign={"center"} fontSize={"3xl"} fontWeight="bold">Place Bid</Text>  
        <br />
        <form onSubmit={handleSubmit}>
            <label>
            Name:
            <input type="text" value={bidderName} onChange={handleNameChange} required />
            </label>
            <label>
            Bid Amount:
            <input type="number" value={bidValue} onChange={handleBidChange} required />
            </label>
            <button className={style.Btn}  type="submit">Place Bid</button>
        </form>
        </div>
      <br />    
      <Text backgroundColor={"teal.200"} textAlign={"center"} fontSize={"3xl"} fontWeight="bold">Leaderboard</Text>  
      <Divider />
      <br />
      <br />
      <TableContainer>
        <Table variant='striped' colorScheme='pink' border={1}>
            <TableCaption>Top 5 Bidders</TableCaption>
            <Thead>
            <Tr>
                <Th>Serial No</Th>
                <Th>Bidder ID</Th>
                <Th>Bidder Name</Th>
                <Th>Bid Amount</Th>
                <Th>Time</Th>
            </Tr>
            </Thead>
            <Tbody>
            {
                leaderboard.map((bidder,i) =>(
                    <Tr key={bidder.bidder_id}>
                        <Td>L{i+1}</Td>
                        <Td>{bidder.bidder_id}</Td>
                        <Td>{bidder.bidder_name}</Td>
                        <Td>$ {bidder.bid_value}</Td>
                        {/* <Td>{bidder.bid_time}</Td> */}
                        <Td>{moment(bidder.bid_time).format("MMMM Do YYYY, h:mm:ss a")}{" "}</Td>

                    </Tr>
                ))
            }
            </Tbody>
        </Table>
        </TableContainer>
    </div>
  );
};

export default Bidder;
