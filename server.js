const app = require('./app');
const cron = require('node-cron');
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

async function deletePastAppointments() {
  try {
    const now = new Date();
    const result = await Appointment.deleteMany({ date: {$lt: now} });
    console.log(`Deleted ${result.deletedCount} past appointments.`);
  } catch (error) {
    console.error('Error deleting past appointments:', error);
  }
}

cron.schedule('0 0 * * *', deletePastAppointments);

deletePastAppointments();