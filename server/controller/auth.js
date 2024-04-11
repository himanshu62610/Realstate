const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
const User =require("../models/User.js");
const Ad =require("../models/Ad.js")
const { hashPassword, comparePassword }=require("../helpers.js/auth.js");
const {sendMail} =require("../helpers.js/email.js");
const { v4: uuidv4 } = require('uuid');
const validator =require("email-validator");
require("dotenv").config();


exports.welcome=(req,res)=>{
res.json({
    data:"hello,welcome to my website"
})
}

function generateRandomId(length) {
  const uuid = uuidv4().replace(/-/g, ''); // Remove hyphens from UUID
  return uuid.substr(0, length); // Get the first 'length' characters from the UUID
}


 const tokenAndUserResponse = (req, res, user) => {

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    //expiresIn:10s if want to see the effect 10s baad token change ho jayenga refresh token ke concept se
    expiresIn: "7h",
  });
  //whaht if we do not use refersh token concept
  const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  //yaha user.password=undefined se humne user model me password aur resetcode ko hide kar diya hai
  //isse ab hum agar user model ko print karnege  to usme password aur resetcode show nahi hoga
  user.password = undefined;
  user.resetCode = undefined;
  return res.json({
    token,
    refreshToken,
    user,
  });
};


exports. preRegister = async (req, res) => {
      // create jwt with email and password then send email as clickable link
      // only when user click on that email link, then data saves and registeration completes

      try {

        //data fetch
        const { name,email, password } = req.body;


        //here we use email-validator .we can alos use express-validator
        //validation
        if (!validator.validate(email)) {
          return res.json({ error: "A valid email is required" });
        }
        if (!password) {
          return res.json({ error: "Password is required" });
        }
        if (password && password?.length < 6) {
          return res.json({ error: "Password should be at least 6 characters" });
        }

        //for unique email 

        //email unique hona agar email database me save hai to firse use nahi kar sakte .email alag chahiye nahi to register wala part work nahi karenga
        //database se email delete kar dena agar ek hi email use karna hai to

        const user = await User.findOne({ email });
        if (user) {
          return res.json({ error: "Email is taken" });
        }

        const token = jwt.sign({ name,email, password }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });


       const content = `<p> Please click the link below to activate your account</p><a href="${process.env.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>`;

        sendMail(email,"Activate your account",content);
        
        return res.json({token});

      } 
      catch (err) {
        console.log(err);
        return res.json({ error: "Something went wrong. Try again." });
      }
    };
    
    

exports.register = async (req, res) => {
  try {

    //sabe phle pre-register karenge uske baad email verifciation hoga
    // email me link hogi jisme token hai 


     //username aur email har baar unique hona chahiye post request me
    //preregister me har bar unique email use karna same email me  token har bar same aayenga 
    //same token(same email) pe do baar post request nahi mar sakte 
    //console.log(req.body.token);
    const {email, password } = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const hashedPassword = await hashPassword(password);

    const user = await new User({
      //humne email aur password validation nahi lagayi hai abhi wo hum preregister me lagayenge
     //nanoid is used to create unique random id

      username:generateRandomId(6),
      email,
      password: hashedPassword,
    }).save();

    tokenAndUserResponse(req,res,user);

  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};


exports.login = async (req, res) => {
  try {

    //data fetch
    const { email, password } = req.body;

    //data validation
    if(!email||!password){
      return
    }
    // 1 find user by email
    const user = await User.findOne({ email });
    if(!user){
      return res.json({ error: "Invalid email and password" });
    }
    // 2 compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({ error: "Invalid email and password" });
    }
    // 3 create jwt tokens  login and signup me userid se hi token banaya hai and send response

   tokenAndUserResponse(req, res, user);

  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "Could not find user with that email" });
    } 
    else {
      const resetCode = generateRandomId(6);
      user.resetCode = resetCode;
      user.save();

      //resetCode me C capital hai 
      const token = jwt.sign({ resetCode }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const emailcontent = `<p>Please click the link below to access your account</p> 
      <a href="${process.env.CLIENT_URL}/auth/access-account/${token}">Access my account</a>`;

     sendMail(email,"Access your account",emailcontent);

      return res.json({
        token
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};

exports.accessAccount = async (req, res) => {
  try {
    //resetcode key hai jwttoken me isliye sedha use check kar rahe hai
    //resetcode ke value ko "" set kar diya taki link ek bar ke liye hi applicable ho

    //ek token ek bar ke liye hi valid hai uske badd resetcode ko"""kar diya hai isliye phirse forgotpassword pe click kare phle
    //waha se token milemga ussse bad account access kare
    //access-account me post request marne par resetcode ki value kya hai wo dekhna hai

    
    //resetCode me C capital hai 
    //resetCode me C capital hai 
    const { resetCode } = jwt.verify(req.body.resetCode,process.env.JWT_SECRET);
    console.log(resetCode);
    const user = await User.findOneAndUpdate(
      { resetCode },
      { resetCode: "" },
      { new: true, upsert: false }
    );
    //token sever verify kar leta hai
    //yaha par hum new token aur new refreshtoken banayenge security enahnce karne ke liye
    //yaha par hum user ko phir se login karne ke force karenge new  token se
    //expiry time ko phir se refresh kar rahe hai hum isse

    tokenAndUserResponse(req, res, user);

  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong. Try again." });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { _id } = jwt.verify(req.headers.refresh_token, process.env.JWT_SECRET);

    const user = await User.findById(_id);

    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Refresh token failed" });
  }
};

exports.currentUser = async (req, res) => {
  try {
   //signin karne ke liye register karne ke baad jo token milenga wo use karna hai

   // req.user._id direct use kar sakte hai agar humne middleware use kar sakte hai
   //req.user._id basically wo user ki _id represent kar raha hai bcoz token me key _id thi

    const user = await User.findById(req.user._id);
    if(!user){
      return res.json(user);
    }
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Unauhorized" });
  }
};

exports.publicProfile = async (req, res) => {
  try {
    //for this endpoints is /api/profile/username hai dhyan rakhna :username nahi hai :username or username ka dhyan rakhna axe se
   
    const user = await User.findOne({ username: req.params.username });
    if(!user){
      return res.json(user);
    }
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "User not found" });
  }
};

exports.updatePassword = async (req, res) => {
  try {

    //middleware use karne ke liye header me authorization me token(jisme key id ho matlab register karne ke baad wala) dena hai 
    
    const { password } = req.body;

    if (!password) {
      return res.json({ error: "Password is required" });
    }
    if (password && password?.length < 6) {
      return res.json({ error: "Password should be min 6 characters" });
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
      password: await hashPassword(password),
    });

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Unauhorized" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
   //middleware use karne ke liye header me authorization me token(jisme key id ho matlab register karne ke baad wala) dena hai 
    
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    if (err.codeName === "DuplicateKey") {
      return res.json({ error: "Username or email is already taken" });
    } else {
      return res.status(403).json({ error: "Unauhorized" });
    }
  }
};


// controller

exports.agents = async (req, res) => {
  try {
    const agents = await User.find({ role: "Seller" }).select(
      "-password -role -enquiredProperties -wishlist -photo.key -photo.Key -photo.Bucket"
    );
    res.json(agents);
  } catch (err) {
    console.log(err);
  }
};

exports.agentAdCount = async (req, res) => {
  try {
    const ads = await Ad.find({ postedBy: req.params._id }).select("_id");
    // console.log("ads count => ", ads);
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

exports.agent = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -role -enquiredProperties -wishlist "
    );
    console.log(user);
    const ads = await Ad.find({ postedBy: user._id }).select(
      "-photos.key -photos.Key -photos.ETag "
    );
    res.json({ user, ads });
  } catch (err) {
    console.log(err);
  }
};