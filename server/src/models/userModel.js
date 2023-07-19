const {Schema,model}= require('mongoose') 
const bcrypt = require('bcryptjs');

const userSchema= new Schema ({

    name:{
        type:String,
        required:[true,'user name is required'],
        trim:true,
        minlength:[3,'user name can be minimun 3 characters'],
        mixlength:[31,'user name can be maximum 31 characters'],

    },
 email:{
        type:String,
        required:[true,'user email is required'],
        trim:true,
        unique:true,
        lowercase:true,
        validate:{
            validator: (v)=>{
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            message:'please inter a valid email'
        }

    },

    password:{
        type:String,
        required:[true,'user password is required'],
        minlength:[6,'user password can be minimun 6 characters'],

        set:(v)=> bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },

    image:{
        type:Buffer,
        contentType:String,
        required:[true,'user image is required'],
     },
    
    address:{
        type:String,
        required:[true,'user address is required'],
        minlength:[3,'user address can be minimun 3 characters'],
    } ,

    phone:{
        type:String,
        required:[true,'user phone  is required'],
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
     isBanned:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
})

const User = model('User',userSchema)

module.exports= User
