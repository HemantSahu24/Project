import express from "express";
const router = express.Router();

import { signin, signup,loginUser, requestOtp } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/loginUsers",loginUser);
router.post("/requestotp",requestOtp);

export default router;