const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

const loginUser = async (req,res)=>{
    const user = await userModel.findOne({email:req.body.email,password:req.body.password})
    console.log(user)
    if(user){
        const token = jwt.sign(user.email,"secret")
        res.send({token,
            id:user._id,
            name:user.name,
            mobile:user.mobile,
            role:user.role,
            email:user.email,
            msg:"Login successfull"})
    }
    else{
        res.send({msg:"user not found"})
    }
}

exports.loginUser = loginUser;