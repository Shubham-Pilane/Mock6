const mongoose=require("mongoose")
const blogSchema=mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      likes: {
        type: Number,
        default: 0,
      },
      comments: [
        {
          username: String,
          content: String,
        },
      ],
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true,
      }
})

const BlogModel=mongoose.model("blogs",blogSchema)

module.exports={
    BlogModel
}