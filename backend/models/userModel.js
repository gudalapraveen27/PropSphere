const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: { type: String, require: true },
    age: { type: Number, require: true },
    gender: { type: String, require: true },
    mobile: { type: Number, require: true },
    role: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    created_on: { type: Date, default: Date.now() + (5.5 * 60 * 60 * 1000) }
})

const userModel = model("User", userSchema);

module.exports = userModel;