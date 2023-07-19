const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const bcrypt = require('bcryptjs');
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jsonAccessKey } = require("../secret");

const handleLogin = async (req,res,next)=>{
   try {
    const {email,password}= req.body
    const user = await User.findOne({email})
    // console.log(email)
    if(!user){
       throw createError(404, "User does not exist with thsi email.Please register first")
    }

     //compaire bcryptjs password match
     const isPasswordMatch = await bcrypt.compare(password, user.password)
      if(!isPasswordMatch){
         throw new Error("Password did not match")
      }
  //isBanned
 
  if(user.isBanned){
     throw new Error("You are banned.Please contact authority")
  }

  //token and cookie
   // Create JSON web token
   const accessToken = createJSONWebToken(
      { email },
      jsonAccessKey,
      "10m"
    );
    res.cookie('access_token', accessToken,{
      maxAge: 15 * 60 * 1000,  //15 minitue only
      httpOnly:true,
      secure:true,
      sameSite:'none'
    })


    return successResponse(res, {
        statusCode: 200,
        message: "User login successfully",
        payload: {
          user
        },
      });


   } 
   catch (error) {
      next(error);
   }
}



const handleLogout = async (req,res,next)=>{
   try {
    res.clearCookie('access_token')
   


    return successResponse(res, {
        statusCode: 200,
        message: "User logout successfully",
        payload: {
        
        },
      });


   } 
   catch (error) {
      next(error);
   }
}

module.exports = {handleLogin,handleLogout}