import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { getUserInfo } from "../controllers/user.controller.js";
const router = Router();

router.route("/get/user").get(getUserInfo)


export default router;