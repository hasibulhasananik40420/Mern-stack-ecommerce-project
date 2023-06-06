require("dotenv").config();
const port = process.env.PORT || 8080
const mongodbUrl = process.env.MONGODB_URL || "mongodb://localhost:27017"

const defaultImagePath = process.env.Defalut_User_Image_Path || 'public/images/users/default.png'

module.exports ={port,mongodbUrl,defaultImagePath}