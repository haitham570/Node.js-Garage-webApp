const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");


router.get("/bookings", auth, async (req, res)=>{
    try {
        const bookings = await Booking.find();
        console.log("Bookings fetched:", bookings);
        res.json(bookings)
    } catch (error) {
        console.error("Error fetching bookings:", error.message);
        res.status(500).send("Server error");
    }
});

router.post("/bookings", auth, async(req, res)=>{
    const { start, carModel,  licencePlate, name, email, phone } = req.body;
    try {
        const existingBookings = await Booking.find({
            start: start
        });

        if (existingBookings.length >= 4) {
            return res.status(400).json({ msg: 'Booking limit reached for this time slot' });
        }
        const newBooking = new Booking ({
            start,
            carModel,
            licencePlate,
            name,
            email,
            phone,
            userId: req.user.id
        });
        await newBooking.save();
        console.log("New booking created:", newBooking);
        res.json(newBooking);
    } catch (error) {
        console.error("Error creating booking:", error.message); 
        res.status(500).send("Server error"); 
    }
});

router.delete("/bookings/:id", auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({msg: "Booking not found"});
        }

        if (booking.userId.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not authorized"});
        }

        await booking.deleteOne();
        res.json({msg: "Booking removed"});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;