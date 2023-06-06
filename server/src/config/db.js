const mongoose = require("mongoose");
const { mongodbUrl } = require("../secret");

const connectDatabase = async (options={}) => {


        try {
            await mongoose.connect(mongodbUrl,options)
            console.log('connected db success')
            
            mongoose.connection.on('error', (error)=>{
                console.error('db connection error:', error)
            })
        } 
        catch (error) {
            console.error('could not connection db:', error.toString())
        }


};

module.exports = connectDatabase
