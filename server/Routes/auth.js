const express=require("express");
const auth = require("../controller/auth.js");
const { requireSignin }=require("../middlewares/auth.js");

const router=express.Router();

//get use and listen are the function of express
//router.get has two argumnet (endpoints,call back function);

router.get("/",requireSignin,auth.welcome);
router.post("/pre-register", auth.preRegister);
router.post("/register", auth.register);
router.post("/login",auth.login);
router.post("/forgot-password",auth.forgotPassword);
router.post("/access-account", auth.accessAccount);
router.get("/refresh-token", auth.refreshToken);
router.get("/current-user", requireSignin, auth.currentUser);
router.get("/profile/:username", auth.publicProfile);
//     /api/profile/username ye endpoints hit karna 

router.put("/update-password", requireSignin, auth.updatePassword);
router.put("/update-profile", requireSignin, auth.updateProfile);

router.get("/agents", auth.agents);
router.get("/agent-ad-count/:_id", auth.agentAdCount);
router.get("/agent/:username", auth.agent);

//yaha koi bhi route mat likhna 

// import formidable from "express-formidable";

// router.use(formidable({ maxFileSize: 5 * 1024 * 1024 }));

// router.post("/upload-images", uploadImages);

//yaha koi bhi route mat likhna 


 module.exports=router;