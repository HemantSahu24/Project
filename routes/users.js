import express from "express";
const router = express.Router();

import { signin, signup, loginUser, requestOtp, requestOtpLogin, changePassword, loginviaOTP } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/loginUsers", loginUser);
router.post("/requestotp", requestOtp);
router.post("/requestotpLogin", requestOtpLogin);
router.post("/loginviaOTP", loginviaOTP);
router.patch("/changePassword", changePassword);

export default router;