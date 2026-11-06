const mongoose =require('mongoose')
const {Schema,model}=mongoose
const userSchema = new Schema(
  {
    name: {
      type: String,
      required:true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique:true,
    },

    password: {
      type: String,
      required:true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      required:true,
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    created_at: {
      type: Date,
      default: () => new Date(Date.now() + (5.5 * 60 * 60 * 1000)),
    },
  },
);

const User = model("User", userSchema);
module.exports=User