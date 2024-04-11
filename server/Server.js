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


dotenv.config();


const PORT = process.env.PORT || 8000;


connect();


cloudinaryConnect();


app.use(express.json());
app.use(morgan("dev"));
app.use(cors());




 app.use("/api",authroutes);
 app.use("/adapi",adroutes);




app.listen(PORT,()=>{
    console.log(`app is listening on port ${PORT}`);
})
