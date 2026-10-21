const express = require("express");
const dbconnect = require("./dbConnection/connection");
const app = express();
const jwt = require("jsonwebtoken")
const cors = require("cors");
const { userRouter } = require("./routers/userRouter");
const { loginUser } = require("./controllers/authController");
const propertyRouter = require("./routers/propertyRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dbconnect()


function checkUser(req, res, next) {
    const token = req.headers.token
    if (!token) {
        return res.status(401).json({
            msg: "Token missing"
        })
    }
    try {
        const decoded = jwt.verify(token, "secret")
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            msg: "Invalid or expired token"
        })
    }
}



app.post("/propsphere/login", loginUser);

app.use("/propsphere", userRouter);

app.use("/propsphere/property", checkUser, propertyRouter);







app.listen(4000, () => {
    console.log("Server running on port 4000")
})