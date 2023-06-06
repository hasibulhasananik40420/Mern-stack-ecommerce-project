const createError = require('http-errors')
const User = require('../models/userModel')
const { successResponse } = require('./responseController')
const {findWithId} = require('../services/findItem')
const fs = require('fs')
  const getUser=async (req,res,next)=>{
   try {
     const search = req.query.search || ''
     const page = Number(req.query.page) || 1 
     const limit = Number(req.query.limit) || 5

     const searchRegExp = new RegExp('.*' + search + '.*','i')
     const filter = {
      isAdmin:{$ne:true},
      $or:[
        {name:{$regex:searchRegExp}},
        {email:{$regex:searchRegExp}},
        {phone:{$regex:searchRegExp}},
      ]
     }

     const options = {password:0}
    

     const users = await User.find(filter,options)
     .limit(limit).skip((page-1)* limit)

     const count = await User.find(filter).countDocuments() 

      if(!users) throw createError(404, 'No user found')
    
    return successResponse(res,{
      statusCode:200, 
      message:'users found successfully',
      payload:{
        users,
        pagination:{
          totalPage: Math.ceil(count /page),
          currentPage :page,
          previousPage: page-1> 0 ? page-1 :null,
          nextPage : page + 1 <= Math.ceil(count /page) ? page + 1 :null

        }
      }
    
    })

   } 
   catch (error) {

     next(error)
   }
}
  



//get single user by id
const getSingleUserById=async (req,res,next)=>{
   try {
    const id = req.params.id 
    const options = {password:0}
   const singleUser =await findWithId(User,id,options)
   
    return successResponse(res,{
      statusCode:200, 
      message:'single user found successfully',
      payload:{
        singleUser
      }
    })

   } 
   catch (error) {
     next(error)
   }
}


//delete single user by id
const deleteSingleUserById=async (req,res,next)=>{
   try {
    const id = req.params.id 
    const options = {password:0}
   const singleUser =await findWithId(User,id,options)
   
     //delete user image
    const userImagePath = singleUser.image 
    fs.access(userImagePath, (err)=>{
      if(err){
        console.error('user iamge does not exist')
      }
      else{
        fs.unlink(userImagePath, (err)=>{
          if(err) throw err 
          console.log('user image was deleted')
        })
      }
    })


      //delete user
     await User.findByIdAndDelete({_id:id, isAdmin:false})
   
    return successResponse(res,{
      statusCode:200, 
      message:'single user delete successfully',
     
    })

   } 
   catch (error) {
     next(error)
   }
}

module.exports = {getUser, getSingleUserById,deleteSingleUserById}
