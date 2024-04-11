const jwt =require("jsonwebtoken");


exports.requireSignin = (req, res, next) => {
  try {
    //middleware use karne ke liye header me authorization me token(jisme key id ho matlab register karne ke baad wala) dena hai 
    

   // req.user._id direct use kar sakte hai agar humne middleware use kar sakte hai
   //req.user._id basically _id represent kar raha hai
    const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user = decoded; // req.user._id
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};