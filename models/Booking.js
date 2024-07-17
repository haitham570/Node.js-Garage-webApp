const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema ({
    start: {type: Date, required: true},
    carModel: {type: String, required: true},
    licencePlate: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    userId: {type: Number, required: true}
});

module.exports = mongoose.model("Booking", BookingSchema);