
const Property = require("../model/property.model");
const Booking = require("../model/booking.model");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

const LOG = "[PROPERTY CONTROLLER]";

const addproperty = async (req, res) => {
  console.log(`\n${LOG} ===== ADD PROPERTY STARTED =====`);

  console.log("[REQUEST] Receiving property details...");

  let propertyData;
  try {
    propertyData = JSON.parse(req.body.propertyData);
  } catch {
    return res.status(400).send({ msg: "Property details are invalid." });
  }

  console.log("[REQUEST] Property Type:", propertyData.propertyType);
  console.log("[REQUEST] Listing Type:", propertyData.listingType);
  console.log("[REQUEST] Seller ID:", propertyData.listedBy);

  console.log("[UPLOAD] Processing property images...");

  const images = await Promise.all(
    (req.files || []).map((file) =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "propsphere/properties", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          },
        );
        Readable.from([file.buffer]).pipe(uploadStream);
      }),
    ),
  );

  console.log("[UPLOAD] Total images uploaded:", images.length);

  const property = new Property({
    ...propertyData,
    images: images,
  });

  console.log("[DATABASE] Saving property details...");

  const result = await property.save();

  console.log("[SUCCESS] Property added successfully");
  console.log("[DATABASE] Property ID:", result._id);
  console.log(`${LOG} ===== ADD PROPERTY COMPLETED =====`);

  res.send({
    msg: "Property added successfully",
    property: result,
  });
};

async function getproperty(req, res) {
  console.log(`\n${LOG} ===== GET ALL PROPERTIES =====`);
  console.log("[DATABASE] Fetching all properties...");

  try {
    const properties = await Property.find();

    console.log("[SUCCESS] Properties fetched:", properties.length);
    console.log(`${LOG} ===== FETCH COMPLETED =====`);

    res.status(200).send({
      msg: "Properties fetched successful",
      properties,
    });
  } catch (err) {
    console.error("[ERROR] Failed to fetch properties:", err.message);

    res.status(500).send({
      msg: "Error fetching properties",
    });
  }
}

async function filterproperty(req, res) {
  console.log(`\n${LOG} ===== FILTER PROPERTIES STARTED =====`);

  console.log("[REQUEST] Filter parameters:", req.query);

  let filter = {};

  if (req.query.property) {
    filter._id = req.query.property;
  }

  if (req.query.id) {
    filter.listedBy = req.query.id;
  }

  if (req.query.city) {
    filter["address.city"] = req.query.city;
  }

  if (req.query.priceRange) {
    filter.price = { $lte: Number(req.query.priceRange) };
  }

  if (req.query.isAvailable !== undefined) {
    filter.isAvailable = req.query.isAvailable === "true";
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.listingType) {
    filter.listingType = req.query.listingType;
  }

  if (req.query.propertyType) {
    filter.propertyType = req.query.propertyType;
  }

  if (req.query.furnishing) {
    filter.furnishing = req.query.furnishing;
  }

  console.log("[PROCESS] Applying property filters...");
  console.log("[DATABASE] MongoDB filter:", filter);

  const properties = await Property.find(filter);

  if (properties.length != 0) {
    console.log("[SUCCESS] Matching properties found:", properties.length);
    console.log(`${LOG} ===== FILTER COMPLETED =====`);

    res.send({
      msg: "Properties filtered successful",
      properties,
    });
  } else {
    console.log("[INFO] No properties match the given filters");

    res.send({
      msg: "Error filtering properties",
    });
  }
}

async function deleteproperty(req, res) {
  console.log(`\n${LOG} ===== DELETE PROPERTY STARTED =====`);

  const { property, id } = req.query;

  console.log("[REQUEST] Property ID:", property);
  console.log("[REQUEST] Seller ID:", id);

  if (!property || !id) {
    console.log("[WARNING] Property ID or seller ID missing");

    res.send({
      msg: "Property ID and seller ID are required",
    });
    return;
  }

  console.log("[DATABASE] Verifying property ownership...");

  const deletedproperty = await Property.findOneAndDelete({
    _id: property,
    listedBy: id,
  });

  if (!deletedproperty) {
    console.log("[WARNING] Property not found or unauthorized");

    res.send({
      msg: "Property not found or unauthorized",
    });
    return;
  }

  console.log("[SUCCESS] Property deleted successfully");
  console.log("[DATABASE] Deleting related bookings...");

  const deletedBookings = await Booking.deleteMany({
    property: property,
  });

  console.log(
    "[SUCCESS] Related bookings deleted:",
    deletedBookings.deletedCount
  );

  console.log(`${LOG} ===== PROPERTY DELETION COMPLETED =====`);

  res.send({
    msg: "Property and related bookings deleted successfully",
  });
}

async function updateproperty(req, res) {
  console.log(`\n${LOG} ===== UPDATE PROPERTY STATUS =====`);

  const { property } = req.body;

  console.log("[REQUEST] Property ID:", property);

  if (!property) {
    console.log("[WARNING] Property ID is required");

    res.send({
      msg: "Property ID is required",
    });
    return;
  }

  console.log("[DATABASE] Searching property...");

  const existingproperty = await Property.findById(property);

  if (!existingproperty) {
    console.log("[WARNING] Property not found");

    res.send({
      msg: "Property not found",
    });
    return;
  }

  console.log("[DATABASE] Current status:", existingproperty.status);
  console.log("[DATABASE] Listing type:", existingproperty.listingType);

  if (existingproperty.status === "Pending") {
    console.log("[PROCESS] Changing property status...");

    if (existingproperty.listingType === "Sale") {
      existingproperty.status = "Sold";
    } else if (existingproperty.listingType === "Rent") {
      existingproperty.status = "Rented";
    }

    existingproperty.isAvailable = false;

    console.log("[UPDATE] Property marked as unavailable");

  } else if (
    existingproperty.status === "Sold" ||
    existingproperty.status === "Rented"
  ) {
    console.log("[PROCESS] Restoring property availability...");

    existingproperty.status = "Pending";
    existingproperty.isAvailable = true;

    console.log("[UPDATE] Property marked as available");
  }

  await existingproperty.save();

  console.log("[SUCCESS] Property status updated");
  console.log("[DATABASE] New status:", existingproperty.status);
  console.log("[DATABASE] Available:", existingproperty.isAvailable);

  console.log(`${LOG} ===== PROPERTY UPDATE COMPLETED =====`);

  res.send({
    msg: "Property updated successful",
    property: existingproperty,
  });
}

module.exports = {
  addproperty,
  getproperty,
  filterproperty,
  deleteproperty,
  updateproperty,
};
