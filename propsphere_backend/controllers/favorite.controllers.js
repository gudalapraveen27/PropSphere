
const Favorite = require("../model/favorite.model");

const LOG = "[FAVORITE CONTROLLER]";

const getfavorites = async (req, res) => {
  console.log(`\n${LOG} ===== GET FAVORITES STARTED =====`);

  console.log("[REQUEST] User ID:", req.query.user);
  console.log("[DATABASE] Searching user's wishlist...");

  const favorites = await Favorite.findOne({
    user: req.query.user,
  });

  if (favorites) {
    console.log("[SUCCESS] Wishlist retrieved successfully");
    console.log("[DATABASE] Favorite properties:", favorites.properties.length);

    return res.send({
      msg: "successfully got favorites",
      favorites,
    });
  }

  console.log("[INFO] No wishlist found for this user");

  return res.send({
    msg: "there are no favorites",
  });
};

const addfavorites = async (req, res) => {
  console.log(`\n${LOG} ===== ADD FAVORITE STARTED =====`);

  const { user, property } = req.body;

  console.log("[REQUEST] User ID:", user);
  console.log("[REQUEST] Property ID:", property);

  console.log("[DATABASE] Checking duplicate favorite...");

  const alreadyexist = await Favorite.findOne({
    user,
    properties: property,
  });

  if (alreadyexist) {
    console.log("[WARNING] Property already exists in wishlist");

    return res.send({
      msg: "already in wishlist",
    });
  }

  console.log("[DATABASE] Checking existing user wishlist...");

  const userexist = await Favorite.findOne({ user });

  if (userexist) {
    console.log("[SUCCESS] Existing wishlist found");
    console.log("[DATABASE] Adding property to existing wishlist...");

    await Favorite.findByIdAndUpdate(
      userexist._id,
      {
        $push: { properties: property },
      },
      { new: true },
    );

    console.log("[SUCCESS] Property added to existing wishlist");

    return res.send({
      msg: "property added to existing wishlist",
    });
  } else {
    console.log("[INFO] No wishlist found. Creating new wishlist...");

    const newuser = new Favorite({
      user,
      properties: [property],
    });

    await newuser.save();

    console.log("[SUCCESS] New wishlist created successfully");

    return res.send({
      msg: "wishlist created successfully",
    });
  }
};

const deletefavorites = async (req, res) => {
  console.log(`\n${LOG} ===== DELETE FAVORITE STARTED =====`);

  const { user, property } = req.body;

  console.log("[REQUEST] User ID:", user);
  console.log("[REQUEST] Property ID:", property);

  console.log("[DATABASE] Removing property from wishlist...");

  const favorites = await Favorite.findOneAndUpdate(
    { user },
    { $pull: { properties: property } },
    { new: true },
  );

  if (!favorites) {
    console.log("[WARNING] Wishlist not found");

    return res.send({
      msg: "wishlist not found",
    });
  }

  console.log("[SUCCESS] Property removed from wishlist");
  console.log("[DATABASE] Remaining favorites:", favorites.properties.length);

  return res.send({
    msg: "property removed from wishlist",
  });
};

module.exports = {
  getfavorites,
  addfavorites,
  deletefavorites,
};
