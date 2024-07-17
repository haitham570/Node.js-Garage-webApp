const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/User");
const Appointment = require("../models/Appointment");


const auth = require("../middleware/auth");



router.get("/register", (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "views", "register.html"));
});

router.post("/register", async (req,res)=>{
    const {name,email, phone, password, userType, securityQuestion, securityAnswer} = req.body;
    console.log(req.body);
    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msg: "User already exists"});
        }
        user = new User({name,email, phone, password, userType, securityQuestion, securityAnswer});
        await user.save();

        const payload = {user: {id: user._id}};

        jwt.sign(payload, "mysecretkey", {expiresIn: 3600}, (err, token)=>{
            if (err) throw err;
            res.json({token});
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/login", (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "views", "login.html"));
});


router.post("/login", async(req, res)=>{
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.log("User not found with email:", email);
            return res.status(400).json({ msg: 'Invalid email credentials' });
        }

        console.log("User found:", user);
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch for user:", user);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
    
        const payload = { user: { id: user._id } };
        jwt.sign(payload, 'mysecretkey', { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
});

router.get("/me", auth, async(req, res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    }catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
router.post("/appointment", auth, async (req, res) => {
    const { name, email, phone, date, time, carModel,carColor,licencePlate, issues } = req.body;

    // Log received appointment data
    console.log("Received appointment request:", req.body);

    // Log user ID from auth middleware
    console.log("User ID from auth middleware:", req.user.id);

    try {
        const existingAppointment = await Appointment.findOne({ user: req.user.id });
        if (existingAppointment) {
            return res.status(400).json({ msg: 'You already have an appointment booked.' });
        }

        const appointmentDate = new Date(`${date}T${time}:00.000Z`);

        const newAppointment = new Appointment({
            user: req.user.id,
            name,
            email,
            phone,
            date: appointmentDate,
            time,
            carModel,
            carColor,
            licencePlate,
            issues,
        });

        // Log the new appointment object
        console.log("Creating new appointment:", newAppointment);

        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error("Error saving appointment: ", err.message);
        res.status(500).send("Server error");
    }
});

router.get("/appointments/booked/:date", async (req, res)=>{
    const {date} = req.params;
    console.log(`Fetching booked times for date: ${date}`);


    try {
        const isoDate = new Date(date).toISOString().split('T')[0];
        console.log(`Converted date to ISO format: ${isoDate}`);

        const appointments = await Appointment.find({
            date: {
                $gte: new Date(`${isoDate}T00:00:00.000Z`),
                $lt: new Date(`${isoDate}T23:59:59.999Z`)
            }
        });
        const bookedTimes = appointments.map(app => app.time);
        res.json(bookedTimes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/appointments/user/:id", auth, async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ user: req.params.id });
        if (!appointment) {
            return res.status(404).json({ msg: 'No appointment found for this user' });
        }

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


router.delete("/appointment/user/:userId/:id", auth, async(req, res)=>{
    try {
        const appointment = await Appointment.findById(req.params.id);

    if(!appointment){
        console.log("Appointment not found");
        return res.status(404).json({msg: "Appointment not found"});
    }

    if (appointment.user !== req.user.id) {
        console.log("User not authorized");
        return res.status(401).json({msg: "User not authorized"});
    }

    await appointment.deleteOne();

    res.json({msg: "Appointment removed"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error")
    }
});

router.get("/appointments/:date/:time", auth, async (req, res)=>{
    try {
        const { date, time } = req.params;
        console.log(`Fetching appointment for date: ${date} and time: ${time}`);

        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const appointment = await Appointment.findOne({
            date: { $gte: startOfDay, $lt: endOfDay },
            time: time
        });
        console.log(`Appointment Query: { date: { $gte: ${startOfDay.toISOString()}, $lt: ${endOfDay.toISOString()} }, time: ${time} }`);

        console.log(`Found appointment: ${JSON.stringify(appointment)}`);
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error")
    }
});

router.get("/appointments", auth, async (req, res) => {
    try {
        const appointments = await Appointment.find().select("date time name");
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


router.put("/update-profile", auth, async(req, res)=>{
    const {name, email, phone} = req.body;

    try{
        let user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({msg: "User not found"});
        }

        console.log("Original user data:", user);

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;



        await user.save();
        console.log("Updated user data:", user);

        res.json(user);
    }catch (err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/recover-password", async (req, res)=>{
    const {email,securityAnswer,newPassword} = req.body;

    try {
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({msg: "User not found"});
        }

        if (securityAnswer !== user.securityAnswer) {
            return res.status(400).json({ msg: 'Security answer is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({msg: "Password updated successfully"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//give feedback
router.put("/submit-feedback", auth, async(req, res)=>{
    const {feedback} = req.body;

    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({msg:"User not found"});
        }

        user.feedback = feedback;
        await user.save();
        res.json({msg: "Feedback submitted successfully"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//fetching feedback

router.get("/users/:id/feedback", auth, async(req, res)=>{
    try {
        const user = await User.findById(req.params.id).select("feedback");
        if(!user){
            return res.status(404).json({msg: "User not found"});
        }
        res.json(user.feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.delete("/users/:id/feedback", auth, async(req, res)=>{
    try {
        console.log(`Received request to delete feedback for user ID: ${req.params.id}`);
        const user = await User.findById(req.params.id);
        if(!user){
            console.log("User not found");
            return res.status(404).json({msg: "User not found"});
        }
        user.feedback = "";
        await user.save();
        res.json({msg: "Feedback deleted successfully"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Get Customer Email Route

router.get("/customers/emails", auth, async(req, res)=>{
    try {
        const customers = await User.find ({userType: "customer"}).select("email-_id");
        const emails = customers.map(customer => customer.email);
        res.json(emails);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Fetching all users 
router.get("/users", auth, async (req, res)=>{
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Delete a user 
router.delete("/users/:id", auth, async (req, res)=>{
    try {
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(404).json({msg: "User not found"});
        }
        await Appointment.deleteMany({ user: req.params.id});
        await user.deleteOne({_id: req.params.id});
        res.json({msd: "User and their appointments removed"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//route to delete past appointments
router.delete("/appointments/check-past", auth, async(req, res)=>{
    try {
        const now = new Date();
        const result = await Appointment.deleteMany({ date: { $lt: now } });
        res.json({ msg: `Deleted ${result.deletedCount} past appointments`});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



module.exports = router;
