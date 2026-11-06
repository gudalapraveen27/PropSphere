const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  property: {
    type: String,
    required: true,
  },

  buyer: {
    type: String,
    required: true,
  },

  seller: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    trim: true,
    maxlength: 500,
  },

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Rejected", "Cancelled"],
    default: "Pending",
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
