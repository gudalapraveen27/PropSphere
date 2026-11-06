
const express = require("express");
const {
  addBooking,
  getBookings,
  getBookingById,
  getBookingsByBuyer,
  getBookingsBySeller,
  deleteBooking,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/booking.controllers");

const router = express.Router();

router.post("/addbooking", addBooking);
router.get("/", getBookings);
router.get("/:id", getBookingById);
router.get("/buyer/:buyer", getBookingsByBuyer);
router.get("/seller/:seller", getBookingsBySeller);
router.delete("/:id", deleteBooking);
router.patch("/:id/status", updateBookingStatus);
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
