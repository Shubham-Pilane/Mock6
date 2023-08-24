const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    username: {type:String},
    avatar: {type:String},
    email: {type:String},
    password: {type:String},
   
})
// {
//     "username" : "Shubham",
//     "avatar": "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=600",
//     "email":"shubham@123",
//     "password":"123"
// }

const UserModel=mongoose.model("user",userSchema)
module.exports={
    UserModel
}