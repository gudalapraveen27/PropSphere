const Property = require("../models/propertyModel");

const createProperty = async (req, res) => {
  try {
    const newProperty = req.body;
    const property = new Property(newProperty);
    await property.save();
    res.status(201).send(property);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).send(properties);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).send({ message: 'Property not found' });
    }
    res.status(200).send(property);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!property) {
      return res.status(404).send({ message: 'Property not found' });
    }
    res.status(200).send(property);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).send({ message: 'Property not found' });
    }
    res.status(200).send({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const filterProperties = async (req, res) => {
  try {
    const filters = req.query;
    const properties = await Property.find(filters);
    res.status(200).send(properties);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  filterProperties
};
