const mongoose=require("mongoose")
require("dotenv").config()

const connection=mongoose.connect("mongodb+srv://shubham:queen@cluster0.x5cpuw5.mongodb.net/Mock6?retryWrites=true&w=majority")


module.exports={
    connection
}
