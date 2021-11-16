import express from "express";
const router = express.Router();

import {SendMailToUser,FindUserForChat, GetDirectPost,directPost,signin, signup, loginUser, requestOtp, requestOtpLogin, changePassword, loginviaOTP } from "../controllers/user.js";
import auth from "../middleware/auth.js";

router.post("/FindUserForChat",auth,FindUserForChat);
router.post("/direct",auth,directPost);
router.post("/SendMailToUser",auth,SendMailToUser);
router.post("/GETdirect",auth,GetDirectPost);
router.post("/signin", signin);
router.post("/signup", signup);
router.post("/loginUsers", loginUser);
router.post("/requestotp", requestOtp);
router.post("/requestotpLogin", requestOtpLogin);
router.post("/loginviaOTP", loginviaOTP);
router.patch("/changePassword", changePassword);

export default router;