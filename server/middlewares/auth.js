const jwt =require("jsonwebtoken");


exports.requireSignin = (req, res, next) => {
  try {
    
    

   
   
    const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};