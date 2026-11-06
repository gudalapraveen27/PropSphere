const express = require("express");
const { adduser, getuser, getuserbyid, updateuser } = require("../controllers/user.controllers");
const router = express.Router();

router.post("/register", adduser);
router.post("/login", getuser);
router.get("/:id", getuserbyid);
router.put("/update/:id", updateuser);
module.exports = router;
