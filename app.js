const express = require("express");
const connectDB=require("./config/db");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

connectDB();

//middleware

app.use(express.json({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//static files
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "views")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/invoices"));
app.use("/api/services", require("./routes/service"));
app.use("/api", require("./routes/booking"));

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/services", (req, res)=>{
    res.sendFile(path.join(__dirname, "views", "services.html"));
});

app.get("/appointment", (req, res)=>{
    res.sendFile(path.join(__dirname, "views", "appointment.html"));
});

app.get("/experience", (req, res)=>{
    res.sendFile(path.join(__dirname, "views", "experience.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "register.html"));
});

module.exports = app;



