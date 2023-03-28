const express = require("express");
const app = express();

app.use(express.json());

const rooms = [
    {
        name: "Elite",
        seats: 100,
        amenities: "wifi, projection screen, AC",
        price: 1500,
        roomID: "100",
        bookingDetails: [
            {
                customerName: "Shalini",
                date: new Date("2023-03-28"),
                start: "07:00 AM",
                end: "10.00 PM",
                status: "confirmed",
            },
        ],
    },
    {
        name: "Premium",
        seats: 70,
        amenities: "wifi, projection screen, AC",
        price: 3000,
        roomID: "102",
        bookingDetails: [
            {
                customerName: "vishnu",
                date: new Date("2023-04-02"),
                start: "07:00 AM",
                end: "10.00 PM",
                status: "Payment Pending",
            },
        ],
    },
];
//create room
app.post("/createRoom", (req, res) => {
    rooms.push({
        name: req.body.name,
        seats: req.body.seats,
        amenities: req.body.amenities,
        price: req.body.price,
        roomId: "103",
        bookingDetails: [{}],
    });
    res.send("Room Created");
});

//Book rooms
app.post("/bookRoom", (req, res, next) => {
    for (let i = 0; i < rooms.length; i++) {
        console.log("a");
        if (!(rooms[i].roomId === req.body.roomId)) {
            return res.status(400).send({ error: "Invalid" });
        } else {
            let booking = {
                customerName: req.body.name,
                date: new Date(req.body.date),
                start: req.body.start,
                end: req.body.end,
                status: "confirmed",
            };
            let result = undefined;
            rooms[i].bookingDetails.forEach((book) => {
                if (
                    book.date.getTime() == booking.date.getTime() &&
                    book.start === booking.start
                ) {
                    result = 0;
                    console.log("in booking");
                } else {
                    result = 1;
                    rooms[i].bookingDetails.push(booking);
                }
            });
            if (result) return res.status(200).send("Booking confirmed");
            else
                return res
                    .status(400)
                    .send({ error: "Please select different time slot" });
        }
    }
});

//List the customers

app.get("/listCustomer", (req, res) => {
    let customerArray = [];

    rooms.forEach((room) => {
        let customerObj = { roomName: room.name };

        room.bookingDetails.forEach((customer) => {
            customerObj.customerName = customer.customerName;
            customerObj.date = customer.date;
            customerObj.start = customer.start;
            customerObj.end = customer.end;

            customerArray.push(customerObj);
        });
    });

    res.send(customerArray);
});

//List room along with booking details

app.get("/listRooms", (req, res) => {
    res.send(rooms);
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log("server running in port", port);
});
