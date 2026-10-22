const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    property: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },]
  },
  {
    timestamps: true,
  }
);


const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;