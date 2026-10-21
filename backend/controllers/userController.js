const userModel = require("../models/userModel")

    
async function createUser(req, res) {
    try {
        const newUser = new userModel({ ...req.body });
        await newUser.save();

        res.status(201).send({
            msg: "User Added"
        });

    } catch (err) {
        console.error("Error creating user:", err.message);
        res.status(500).send({
            msg: "Internal Server Error"
        });
    }
}

module.exports = {
    createUser
};