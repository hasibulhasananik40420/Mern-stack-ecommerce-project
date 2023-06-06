const express = require('express') 
const {getUser, getSingleUserById, deleteSingleUserById} = require('../controllers/userController')
const userRouter= express.Router()


userRouter.get('/',getUser)
userRouter.get('/:id',getSingleUserById)
userRouter.delete('/:id',deleteSingleUserById)


module.exports = userRouter