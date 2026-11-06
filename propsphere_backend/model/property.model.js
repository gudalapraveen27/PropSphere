const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  propertyType: {
    type: String,
    enum: ["Apartment", "Independent House", "Villa", "Plot", "Commercial"],
    required: true,
  },

  listingType: {
    type: String,
    enum: ["Sale", "Rent"],
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  address: {
    street: {
      type: String,
      trim: true,
    },
    locality: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
  },

  bedrooms: {
    type: Number,
    min: 0,
    default: 0,
  },

  bathrooms: {
    type: Number,
    min: 0,
    default: 0,
  },

  area: {
    type: Number,
    required: true,
    min: 0,
  },

  areaUnit: {
    type: String,
    enum: ["sqft", "sqyd", "sqm"],
    default: "sqft",
  },

  furnishing: {
    type: String,
    enum: ["Unfurnished", "Semi-Furnished", "Fully-Furnished"],
    default: "Unfurnished",
  },

  images: [
    {
      type: String,
    },
  ],

  amenities: [
    {
      type: String,
      trim: true,
    },
  ],

  listedBy: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["Pending", "Sold", "Rented"],
    default: "Pending",
  },

  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
