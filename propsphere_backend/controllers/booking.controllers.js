
const Booking = require("../model/booking.model");
const Property = require("../model/property.model");

const LOG = "[BOOKING CONTROLLER]";

const addBooking = async (req, res) => {
  console.log(`\n${LOG} ===== ADD BOOKING STARTED =====`);
  console.log("[REQUEST] Buyer:", req.body.buyer);
  console.log("[REQUEST] Property:", req.body.property);

  const existing = await Booking.findOne({
    buyer: req.body.buyer,
    property: req.body.property,
  });

  console.log("[DATABASE] Duplicate booking check completed");

  if (!existing) {
    console.log("[DATABASE] No existing booking found");
    console.log("[DATABASE] Creating new booking...");

    const booking = new Booking(req.body);
    await booking.save();

    console.log("[SUCCESS] Booking saved successfully");
    console.log(`${LOG} ===== ADD BOOKING COMPLETED =====`);

    res.send({ message: "Booking added successfully" });
  } else {
    console.log("[WARNING] Buyer has already booked this property");
    console.log(`${LOG} ===== ADD BOOKING STOPPED =====`);

    res.send({ message: "Already booked" });
  }
};

const getBookings = async (req, res) => {
  console.log(`\n${LOG} ===== GET ALL BOOKINGS =====`);
  console.log("[DATABASE] Fetching all bookings...");

  const bookings = await Booking.find();

  console.log("[SUCCESS] Total bookings found:", bookings.length);
  console.log(`${LOG} ===== FETCH COMPLETED =====`);

  res.send(bookings);
};

const getBookingById = async (req, res) => {
  console.log(`\n${LOG} ===== GET BOOKING BY ID =====`);
  console.log("[REQUEST] Booking ID:", req.params.id);

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    console.log("[WARNING] Booking not found");
    return res.send({ message: "Booking not found" });
  }

  console.log("[SUCCESS] Booking details retrieved");
  res.send(booking);
};

const getBookingsByBuyer = async (req, res) => {
  console.log(`\n${LOG} ===== GET BOOKINGS BY BUYER =====`);
  console.log("[REQUEST] Buyer ID:", req.params.buyer);

  const bookings = await Booking.find({
    buyer: req.params.buyer,
  });

  console.log("[SUCCESS] Buyer bookings found:", bookings.length);
  res.send(bookings);
};

const getBookingsBySeller = async (req, res) => {
  console.log(`\n${LOG} ===== GET BOOKINGS BY SELLER =====`);
  console.log("[REQUEST] Seller ID:", req.params.seller);

  const bookings = await Booking.find({
    seller: req.params.seller,
  });

  console.log("[SUCCESS] Seller bookings found:", bookings.length);
  res.send(bookings);
};

const deleteBooking = async (req, res) => {
  console.log(`\n${LOG} ===== DELETE BOOKING =====`);
  console.log("[REQUEST] Booking ID:", req.params.id);

  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    console.log("[WARNING] Booking not found");
    return res.send({ message: "Booking not found" });
  }

  console.log("[DATABASE] Booking deleted successfully");
  res.send({ message: "Booking deleted successfully" });
};

async function updateBookingStatus(req, res) {
  console.log(`\n${LOG} ===== UPDATE BOOKING STATUS =====`);

  const { status, seller } = req.body;
  const { id } = req.params;

  console.log("[REQUEST] Booking ID:", id);
  console.log("[REQUEST] Seller ID:", seller);
  console.log("[REQUEST] New Status:", status);

  if (!["Confirmed", "Rejected"].includes(status)) {
    console.log("[WARNING] Invalid booking status");
    return res.send({ message: "Invalid booking status" });
  }

  console.log("[DATABASE] Verifying seller and booking...");

  const booking = await Booking.findOne({
    _id: id,
    seller: seller,
  });

  if (!booking) {
    console.log("[WARNING] Booking not found or unauthorized");
    return res.send({ message: "Booking not found or unauthorized" });
  }

  console.log("[SUCCESS] Booking verified");

  const property = await Property.findOne({
    _id: booking.property,
    listedBy: seller,
  });

  if (!property) {
    console.log("[WARNING] Property not found or unauthorized");
    return res.send({ message: "Property not found or unauthorized" });
  }

  console.log("[SUCCESS] Property ownership verified");

  if (status === "Confirmed") {
    console.log("[PROCESS] Confirming buyer booking...");

    if (!property.isAvailable && booking.status !== "Confirmed") {
      console.log("[WARNING] Property is not available");
      return res.send({ message: "Property is not available" });
    }

    if (booking.status === "Cancelled") {
      console.log("[WARNING] Cancelled booking cannot be accepted");
      return res.send({ message: "Cancelled booking cannot be accepted" });
    }

    property.status =
      property.listingType === "Sale" ? "Sold" : "Rented";
    property.isAvailable = false;

    await property.save();

    console.log("[DATABASE] Property status updated:", property.status);
    console.log("[DATABASE] Property availability set to false");

    const rejectedBookings = await Booking.updateMany(
      {
        property: booking.property,
        seller: seller,
        status: "Pending",
        _id: { $ne: booking._id },
      },
      {
        $set: { status: "Rejected" },
      }
    );

    console.log(
      "[DATABASE] Other pending bookings rejected:",
      rejectedBookings.modifiedCount
    );

    booking.status = "Confirmed";
    await booking.save();

    console.log("[SUCCESS] Buyer booking confirmed");
    console.log(`${LOG} ===== BOOKING CONFIRMED =====`);

    res.send({
      message: "Buyer accepted and property updated successfully",
      booking,
      property,
    });
    return;
  }

  console.log("[PROCESS] Rejecting buyer booking...");

  if (booking.status === "Confirmed") {
    console.log("[PROCESS] Restoring property availability");

    property.status = "Pending";
    property.isAvailable = true;

    await property.save();

    console.log("[DATABASE] Property availability restored");
  }

  booking.status = "Rejected";
  await booking.save();

  console.log("[SUCCESS] Booking rejected successfully");
  console.log(`${LOG} ===== BOOKING REJECTED =====`);

  res.send({
    message: "Booking rejected successfully",
    booking,
    property,
  });
}

async function cancelBooking(req, res) {
  console.log(`\n${LOG} ===== CANCEL BOOKING =====`);

  const { buyer } = req.body;
  const { id } = req.params;

  console.log("[REQUEST] Buyer ID:", buyer);
  console.log("[REQUEST] Booking ID:", id);

  if (!buyer || !id) {
    console.log("[WARNING] Missing buyer or booking ID");
    return res.send({
      message: "Booking ID and buyer ID are required",
    });
  }

  console.log("[DATABASE] Verifying buyer booking...");

  const booking = await Booking.findOne({
    _id: id,
    buyer: buyer,
  });

  if (!booking) {
    console.log("[WARNING] Booking not found or unauthorized");
    return res.send({ message: "Booking not found or unauthorized" });
  }

  console.log("[SUCCESS] Booking verified");

  if (booking.status === "Cancelled") {
    console.log("[WARNING] Booking is already cancelled");
    return res.send({ message: "Booking is already cancelled" });
  }

  if (booking.status === "Rejected") {
    console.log("[WARNING] Rejected booking cannot be cancelled");
    return res.send({
      message: "Rejected bookings cannot be cancelled",
    });
  }

  if (booking.status === "Confirmed") {
    console.log("[PROCESS] Restoring property availability...");

    const property = await Property.findOne({
      _id: booking.property,
      listedBy: booking.seller,
    });

    if (property) {
      property.status = "Pending";
      property.isAvailable = true;
      await property.save();

      console.log("[DATABASE] Property availability restored");
    } else {
      console.log("[WARNING] Related property not found");
    }
  }

  booking.status = "Cancelled";
  await booking.save();

  console.log("[SUCCESS] Booking cancelled successfully");
  console.log(`${LOG} ===== CANCELLATION COMPLETED =====`);

  res.send({
    message: "Booking cancelled successfully",
    booking,
  });
}

module.exports = {
  addBooking,
  getBookings,
  getBookingById,
  getBookingsByBuyer,
  getBookingsBySeller,
  deleteBooking,
  updateBookingStatus,
  cancelBooking,
};
