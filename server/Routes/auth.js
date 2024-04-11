const express=require("express");
const auth = require("../controller/auth.js");
const { requireSignin }=require("../middlewares/auth.js");

const router=express.Router();




router.get("/",requireSignin,auth.welcome);
router.post("/pre-register", auth.preRegister);
router.post("/register", auth.register);
router.post("/login",auth.login);
router.post("/forgot-password",auth.forgotPassword);
router.post("/access-account", auth.accessAccount);
router.get("/refresh-token", auth.refreshToken);
router.get("/current-user", requireSignin, auth.currentUser);
router.get("/profile/:username", auth.publicProfile);


router.put("/update-password", requireSignin, auth.updatePassword);
router.put("/update-profile", requireSignin, auth.updateProfile);

router.get("/agents", auth.agents);
router.get("/agent-ad-count/:_id", auth.agentAdCount);
router.get("/agent/:username", auth.agent);












 module.exports=router;