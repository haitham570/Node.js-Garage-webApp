const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    user: {
        type: Number,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    carModel: {
        type: String,
        required: true
    },
    carColor: {
        type: String,
        required: true
    },
    licencePlate: {
        type: String,
        required: true
    },
    issues: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
