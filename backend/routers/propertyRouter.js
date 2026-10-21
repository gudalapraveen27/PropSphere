const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");

router.post("/", propertyController.createProperty);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperty);
router.post("/filter", propertyController.filterProperties);

module.exports = router;