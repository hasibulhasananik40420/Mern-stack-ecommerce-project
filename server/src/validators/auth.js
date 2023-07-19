const {body} = require('express-validator')
//registation validation 
const validateUserRegistation = [
    body("name")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Name is Required.Enter your name")
    .isLength({min:3, max:31})
    .withMessage("Name should be 3-31 characters long"),
    
    body("email")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Email is Required.Enter your email")
    .isEmail()
    .withMessage("Invalid email address"),

 body("password")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Password is Required.Enter your password")
    .isLength({min:6})
    .withMessage("Password should be at least 6 characters long")
    //  .matches(aikne bosbe Regular Expression)
    // .withMessage("")
    //Password Regular Expression added
    ,

    body("phone")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("phone is Required.Enter your phone number"),
    

 body("address")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Address is Required.Enter your address")
    .isLength({min:3})
    .withMessage("Address should be at least 3 characters long"),

  
 body("image")
 .custom((value,{req})=>{
   if(!req.file || !req.file.buffer){
      throw new Error("User image is required")
   }
   return true
 })
  
  .withMessage("User image is required"),
  

]




module.exports=validateUserRegistation
