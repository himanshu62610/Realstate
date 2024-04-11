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
  const uuid = uuidv4().replace(/-/g, ''); 
  return uuid.substr(0, length); 
}


 const tokenAndUserResponse = (req, res, user) => {

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    
    expiresIn: "7h",
  });
  
  const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  
  
  user.password = undefined;
  user.resetCode = undefined;
  return res.json({
    token,
    refreshToken,
    user,
  });
};


exports. preRegister = async (req, res) => {
      
      

      try {

        
        const { name,email, password } = req.body;


        
        
        if (!validator.validate(email)) {
          return res.json({ error: "A valid email is required" });
        }
        if (!password) {
          return res.json({ error: "Password is required" });
        }
        if (password && password?.length < 6) {
          return res.json({ error: "Password should be at least 6 characters" });
        }

        

        
        

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

    
    


     
    
    
    
    const {email, password } = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const hashedPassword = await hashPassword(password);

    const user = await new User({
      
     

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

    
    const { email, password } = req.body;

    
    if(!email||!password){
      return
    }
    
    const user = await User.findOne({ email });
    if(!user){
      return res.json({ error: "Invalid email and password" });
    }
    
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({ error: "Invalid email and password" });
    }
    

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
    
    

    
    
    

    
    
    
    const { resetCode } = jwt.verify(req.body.resetCode,process.env.JWT_SECRET);
    console.log(resetCode);
    const user = await User.findOneAndUpdate(
      { resetCode },
      { resetCode: "" },
      { new: true, upsert: false }
    );
    
    
    
    

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