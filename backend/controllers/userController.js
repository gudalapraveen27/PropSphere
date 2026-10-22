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

async function getUserById(req, res) {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).send({
                msg: "User ID is required",
            })
        }
        const user = await userModel.findById(userId).select(
            "name email mobile role"
        )
        if (!user) {
            return res.status(404).send({
                msg: "User not found",
            })
        }
        return res.status(200).send({
            user,
        })
    } catch (err) {
        console.error("Error fetching user:", err.message)
        return res.status(500).send({
            msg: "Internal Server Error",
        })
    }
}


module.exports = {
    createUser,
    getUserById
};