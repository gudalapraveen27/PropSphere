const express = require("express");
const {
  addproperty,
  getproperty,
  filterproperty,
  deleteproperty,
  updateproperty,
} = require("../controllers/property.controllers");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/addproperty", upload, addproperty);
router.get("/", getproperty);
router.get("/filterproperty", filterproperty);
router.delete("/deleteproperty", deleteproperty);
router.put("/updateproperty", updateproperty);
module.exports = router;
