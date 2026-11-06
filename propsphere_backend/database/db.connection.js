const mongoose = require("mongoose");
require("dotenv").config();

const connect = function () {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set in the backend environment.");
  }

  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "propsphere",
    })
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => console.log(err));
};

module.exports = connect;
