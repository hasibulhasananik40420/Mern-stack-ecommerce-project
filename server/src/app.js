const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser= require('body-parser')
const createError = require('http-errors')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const userRouter = require('./routers/userRouter')
const seedRouter = require('./routers/seedRouter')
const { errorResponse } = require('./controllers/responseController')


const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 5, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
  message:"to many request . try again",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


app.use(xssClean())
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(limiter)

//user router
app.use('/api/users',userRouter)
app.use('/api/seed',seedRouter)





app.get('/api/user',(req,res)=>{
  console.log(req.body.id)
  res.status(200).send({
    message:"user found"
  })
})



app.get('/', (req, res) => {
  res.send('Hello World!')
})

//client error handleing
app.use((req,res,next)=>{
  next(createError(404, "route not found"))
})


//server error handleing
app.use((err,req,res,next)=>{
  return errorResponse(res,{statusCode:err.status,
     message:err.message})
})

module.exports = app