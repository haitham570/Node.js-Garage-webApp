const mongoose = require('mongoose');
const Booking = require('./models/Appointment');  // Adjust the path if necessary

// Connect to the database
mongoose.connect('mongodb://localhost:27017/AutoEliteDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function deleteAllBookings() {
    try {
        // Delete all bookings
        const result = await Booking.deleteMany({});
        console.log(`Cleanup complete. Total bookings deleted: ${result.deletedCount}`);
    } catch (error) {
        console.error('Error deleting bookings:', error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

deleteAllBookings();
