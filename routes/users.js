import express from "express";
const router = express.Router();

import { signin, signup,loginUser } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/loginUsers",loginUser);

export default router;