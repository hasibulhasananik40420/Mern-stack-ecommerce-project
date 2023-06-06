const data = require("../data")
const User = require("../models/userModel")

const seedUsers = async(req,res,next)=>{
    try {
        //deleting all extist users
         await User.deleteMany({})

         //inserting new  users
         const users =await User.insertMany(data.users)
         console.log(users)

         //succesfull insert
         return res.status(201).json(users)


    } 
    catch (error) {
        next(error)
    }
}


module.exports = {seedUsers}