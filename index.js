const express=require("express")
const {connection}=require("./db")
const cors=require("cors")
const bodyparser=require("body-parser")
const app=express()
// app.use(express.json())
app.use(cors())
app.use(bodyparser.json())


app.get("/",(req,res)=>{
    res.send("This is home page")
})

const authRoute=require("./routes/authRoute")
const blogRoute=require("./routes/blogRoute")

app.use("/auth",authRoute)
app.use("/blog",blogRoute)



let port=process.env.PORT
app.listen(port,async()=>{
    try {
        await connection
        console.log("Connected to Database !!")
    } catch (error) {
        console.log(error)
    }
    console.log("Server is live on port 8000")
})




