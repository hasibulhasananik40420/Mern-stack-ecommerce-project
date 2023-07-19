const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jsonActivationKey, clientUrl } = require("../secret");
const emailWithNodemiller = require("../helper/email");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");

const getUser = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "No user found");

    return successResponse(res, {
      statusCode: 200,
      message: "users found successfully",
      payload: {
        users,
        pagination: {
          totalPage: Math.ceil(count / page),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / page) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

//get single user by id
const getSingleUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const singleUser = await findWithId(User, id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "single user found successfully",
      payload: {
        singleUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

//delete single user by id
const deleteSingleUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const singleUser = await findWithId(User, id, options);

    //delete user image
    const userImagePath = singleUser.image;
    deleteImage(userImagePath);

    //delete user
    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successResponse(res, {
      statusCode: 200,
      message: "single user delete successfully",
    });
  } catch (error) {
    next(error);
  }
};

//create a user in database

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

     const image = req.file

     if(!image){
      throw createError(400,'image file is required')
     } 

    //  console.log(image)
     
     if(image.size > 1024 * 1024 * 2 ){
      throw createError(400,'File to large.It must be less then 2 MB')
     }

    const imageBufferString = image.buffer.toString("base64");

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(409, "User already exists. Please login.");
    }

    // Create JSON web token
    const token = createJSONWebToken(
      { name, email, password, phone, address, image: imageBufferString },
      jsonActivationKey,
      "10m"
    );

    // Prepare email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
        <h2>Hello ${name}</h2>
        <p>Please click here to <a href="${clientUrl}/api/user/activate/${token}" target="_blank">activate your account</a>.</p>
      `,
    };

    // Send email with nodemailer
    try {
      await emailWithNodemiller(emailData);
    } catch (emailError) {
      console.error("Error occurred while sending email:", emailError);
      throw emailError;
    }

    return successResponse(res, {
      statusCode: 200,

      message: `Please go to your ${email} for completing your registration process.`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "token not found");

    try {
      const decoded = jwt.verify(token, jsonActivationKey);
      if (!decoded) throw createError(401, "unable to verify user");

      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createError(409, "User already exists. Please login.");
      }

      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: "user register successfully",
      });
    } catch (error) {
      if (error.name === "TokenExpiredErroe") {
        throw createError(401, "token has expired ");
      } else if (error.name === "jsonWebTokenError") {
        throw createError(401, "invalid token ");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

//update single user by id
const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
     await findWithId(User, userId, options);

    
    const updateOptions = { new: true, runValidators: true, context: "query" };
    //name, email, password, phone, address,image
    let updates = {};


    for(let key in req.body){
      if(['name', 'password','phone', 'address'].includes(key)){
        updates[key]= req.body[key]
      } 
      else if(['email'].includes(key)){
        throw new Error('Email can not be updated')
      }
    }
   
     const image = req.file 
     if(image){
      //image size maximum 2 mb
      if(image.size > 1024 * 1024 * 2 ){
        throw createError(400,'File to large.It must be less then 2 MB')
       }

       updates.image = image.buffer.toString('base64')
     }

      // delete updates.email

     const updateUser= await User.findByIdAndUpdate(userId,updates,updateOptions).select('-password')

      if(!updateUser){
        throw createError(404,'User with this id does not exist')
      }
     

    return successResponse(res, {
      statusCode: 200,
      message: "single user update successfully",
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  getSingleUserById,
  deleteSingleUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
};
