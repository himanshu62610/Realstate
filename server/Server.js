const express= require("express");
const app=express();
const morgan =require("morgan");
const cors = require("cors");
 const authroutes = require("./Routes/auth.js")
const adroutes = require("./Routes/ad.js")
const bodyParser =require("body-parser");
const cloudinaryConnect=require("./config/cloudinary.js")
const connect= require("./config/database.js")

const dotenv =require('dotenv')

// Loading environment variables from .env file
dotenv.config();

// Setting up port number
const PORT = process.env.PORT || 8000;

///connection to db
connect();

//connection to cloudinary
cloudinaryConnect();

//use middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
//


// //routes middleware
 app.use("/api",authroutes);//1
 app.use("/adapi",adroutes);//2

//1 or 2 me "/api" or "/adapi" matlab diifrent endpoint use karna .1 or 2 me same endpoints nahi hona chahiye

//app.listen has two argumnet (port,call back function);
app.listen(PORT,()=>{
    console.log(`app is listening on port ${PORT}`);
})
