const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },

  properties: [
    {
      type: String,
    },
  ],
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
