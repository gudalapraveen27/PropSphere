
const User = require("../model/users.model");
const jwt = require("jsonwebtoken");

const LOG = "[USER CONTROLLER]";

async function adduser(req, res) {
  console.log(`\n${LOG} ===== USER REGISTRATION STARTED =====`);

  console.log("[REQUEST] New user registration received");
  console.log("[REQUEST] Email:", req.body.email);

  console.log("[DATABASE] Checking whether user already exists...");

  const existinguser = await User.findOne({
    email: req.body.email,
  });

  if (existinguser) {
    console.log("[WARNING] User already exists");

    return res.send({
      msg: "user already exist",
    });
  }

  console.log("[DATABASE] No existing user found");
  console.log("[DATABASE] Creating new user...");

  const newuser = User(req.body);

  await newuser.save();

  console.log("[SUCCESS] User registered successfully");
  console.log("[DATABASE] New user ID:", newuser._id);

  console.log(`${LOG} ===== REGISTRATION COMPLETED =====`);

  res.send({
    msg: "user added successful",
  });
}

const getuser = async (req, res) => {
  console.log(`\n${LOG} ===== USER LOGIN STARTED =====`);

  console.log("[REQUEST] Login request received");
  console.log("[REQUEST] Email:", req.body.email);
  console.log("[AUTHENTICATION] Verifying user credentials...");

  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    console.log("[SUCCESS] User credentials verified");
    console.log("[AUTHENTICATION] Generating JWT token...");

    const token = jwt.sign(user.email, process.env.JWT_SECRET);

    console.log("[SUCCESS] JWT token generated");
    console.log("[USER] Role:", user.role);
    console.log("[USER] User ID:", user._id);

    console.log(`${LOG} ===== LOGIN COMPLETED =====`);

    res.send({
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      id: user._id,
      token,
    });

  } else {
    console.log("[WARNING] Invalid login credentials");
    console.log(`${LOG} ===== LOGIN FAILED =====`);

    res.send({
      msg: "user not found",
    });
  }
};

const getuserbyid = async (req, res) => {
  console.log(`\n${LOG} ===== GET USER BY ID =====`);

  console.log("[REQUEST] User ID:", req.params.id);
  console.log("[DATABASE] Fetching user details...");

  const user = await User.findOne({
    _id: req.params.id,
  });

  if (user) {
    console.log("[SUCCESS] User details retrieved");

    res.send({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

  } else {
    console.log("[WARNING] User not found");

    res.send({
      msg: "user not found",
    });
  }
};

const deleteuser = async (req, res) => {
  console.log(`\n${LOG} ===== DELETE USER STARTED =====`);

  console.log("[REQUEST] Account deletion requested");

  const user = await User.findOneAndDelete({
    email: req.body.email,
  });

  if (user) {
    console.log("[SUCCESS] User account deleted");
    console.log("[DATABASE] Deleted user ID:", user._id);

    res.send({
      msg: "user deleted successfully",
    });

  } else {
    console.log("[WARNING] User not found");

    res.send({
      msg: "user not found",
    });
  }
};

const updateuser = async (req, res) => {
  console.log(`\n${LOG} ===== UPDATE USER PROFILE STARTED =====`);

  const { name, email, phone } = req.body;
  const { id } = req.params;

  console.log("[REQUEST] User ID:", id);
  console.log("[REQUEST] Profile update received");

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    console.log("[WARNING] Required profile fields are missing");

    res.send({
      msg: "Name, email and phone are required",
    });

    return;
  }

  try {
    console.log("[DATABASE] Updating user profile...");

    const user = await User.findByIdAndUpdate(id, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    if (!user) {
      console.log("[WARNING] User not found");

      res.send({
        msg: "User not found",
      });

      return;
    }

    console.log("[SUCCESS] User profile updated");
    console.log("[DATABASE] User ID:", user._id);
    console.log("[DATABASE] Updated email:", email.trim());

    console.log(`${LOG} ===== PROFILE UPDATE COMPLETED =====`);

    res.send({
      msg: "Profile updated successfully",
      user: {
        name: name,
        email: email,
        phone: phone,
      },
    });

  } catch (err) {
    console.error("[ERROR] Profile update failed:", err.message);

    if (err.code === 11000) {
      console.log("[WARNING] Email already exists");

      res.send({
        msg: "Email already exists",
      });

      return;
    }

    res.send({
      msg: "Failed to update profile",
    });
  }
};

module.exports = {
  adduser,
  getuser,
  deleteuser,
  getuserbyid,
  updateuser,
};
