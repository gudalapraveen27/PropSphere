const express = require("express");
const { createUser, getUserById } = require("../controllers/userController");
const router = express.Router();


router.post("/register", createUser);
router.get("/getUserById/:id", getUserById)

exports.userRouter = router;