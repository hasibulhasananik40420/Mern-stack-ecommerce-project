const express = require('express') 
const {getUser, getSingleUserById, deleteSingleUserById, processRegister, activateUserAccount, updateUserById} = require('../controllers/userController')
const upload = require('../middlewares/uploadFile')
const validateUserRegistation = require('../validators/auth')
const runValidation = require('../validators')
const userRouter= express.Router()

userRouter.post('/process-register',
upload.single("image") ,
validateUserRegistation,
runValidation,
processRegister ) //validateUserRegistation,upload,runValidation are middleware
userRouter.post('/activate',activateUserAccount )
userRouter.get('/',getUser)
userRouter.get('/:id',getSingleUserById)
userRouter.delete('/:id',deleteSingleUserById)
userRouter.put('/:id',upload.single("image"), updateUserById)


module.exports = userRouter