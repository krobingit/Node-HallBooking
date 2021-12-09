import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());
//rooms collection
let rooms = [{
 "name": "Standard",
 "seats": "150", "price": "1000",
 "amenities": "wifi,non-ac,screen with projector",
 "roomID": "100",
 "bookedDetails": [{
  "customerName": "Robin", "bookedDate": new Date('2020-11-20'),
  "startTime": "2020-11-20T08:30", "endTime": "2020-11-20T11:30", "status": "confirmed", "roomID": "100"
 }]
},
 {
  "name": "Elite", "seats": "250", "price": "2000",
  "amenities": "wifi,ac,screen with projector", "roomID": "101",
  "bookedDetails": [{
   "customerName": "Sam", "bookedDate": new Date('2020-11-25'),
   "startTime": "2020-11-25T15:30", "endTime": "2020-11-25T17:30", "status": "confirmed", "roomID": "101"
  }]
 }, {
  "name": "Premium", "seats": "350", "price": "3000",
  "amenities": "wifi,ac,screen with projector", "roomID": "102",
  "bookedDetails": [{
   "customerName": "Sarvana", "bookedDate": new Date('2020-12-25'),
   "startTime": "2020-12-25T20:30", "endTime": "2020-12-25T22:30", "status": "Payment_Pending", "roomID": "102"
  }]
 }]

app.get("/", (req, res) => {
 res.send({
  message: "server running!!!"
 })

})
//create a Room
app.post("/createRoom", (req, res) => {

 const { name, seats, price, amenities, roomID,bookedDetails  } = req.body;
 rooms.push([{
  name, seats, price, amenities, roomID, bookedDetails

 }])
res.send("Room Created")

})
//booking room
app.post("/bookRoom",(req, res)=> {

 let { customerName, bookedDate, startTime, endTime, status, roomID } = req.body;
//TS- Timestamp in unix
 //converting input date-time to timestamp
 let startTS = Date.parse(startTime);
 let endTS = Date.parse(endTime);
 for (let i = 0; i < rooms.length;i++) {

  if (rooms[i].roomID === roomID) {

   let tobeBooked =
   {
    customerName,
    bookedDate, startTime, endTime, status, roomID
   }
   let isBooked = null;
   isBooked = rooms[i].bookedDetails.every((booking) => {
     //converting already booked-date-time into timestamp
    //TS-Timestamp
     let startBookedTS = Date.parse(booking.startTime);
    let endBookedTS = Date.parse(booking.endTime);
    //booking should not be allowed for same start-time and between the hall booked timing hours!!
    return (booking.startTime !== startTime) && ((startTS > endBookedTS && endTS > endBookedTS)
    || (startTS<startBookedTS && endTS<startBookedTS))
   }
      );
   if (isBooked) //if the condition is true
   {//stores the booked data in rooms array
    rooms[i].bookedDetails.push(tobeBooked)
    return res.status(200).send({ message: "Booking confirmed", rooms })
   }

   else
     //throws an error if the booked date and timing hours coincide
    return res.status(400).send({ message: "Already booked Room,Please Select Different Time slot" })
  }

 }

 }

)

//list all rooms with booked data
app.get("/listRooms",(req,res)=>{
res.send(rooms)
})

//list all customers with booked data(room name included)
app.get("/listCustomers", (req, res) => {

 const customers = rooms.map((room) => {
  return [...room.bookedDetails,{RoomName:room.name}]
 })

})
app.listen(PORT,()=>console.log("Server Started"))