const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const userrouter = require("./routes/user.routes");
const propertyrouter = require("./routes/property.routes");
const dbconnection = require("./database/db.connection");
const { favoriterouter } = require("./routes/favorite.routes");
const bookingrouter = require("./routes/booking.routes");
// const  favorite = require("./routes/favorite.routes");
dbconnection();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({
    origin: "https://propsphere-eight.vercel.app",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


function checkToken(req, res, next) {
  const token = req.headers.token;
  if (!token) return res.status(401).send({ msg: "token not found" });
  try {
    req.email = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).send({ msg: "Invalid or expired token" });
  }
}
app.get("/health", (req, res) => res.status(200).send({ status: "ok" }));
app.use("/user", userrouter);
app.use("/property", checkToken, propertyrouter);
app.use("/favorite", checkToken,favoriterouter);
app.use("/bookings",checkToken,bookingrouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`propsphere backend server running on port ${port}`);
});
