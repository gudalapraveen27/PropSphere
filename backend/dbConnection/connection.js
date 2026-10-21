const mongoose = require("mongoose");

function dbconnect() {
    mongoose.connect("mongodb+srv://dbuser2:hello123@praveenkumar.yp2f0c.mongodb.net/", {
        dbName: "propsphere"
    })
    .then(() => { console.log("Connected to MongoDb") })
    .catch((err) => console.log(err))
}

module.exports = dbconnect