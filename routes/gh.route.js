import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { getAllGh } from "../controllers/gh.controller.js";
const router = Router();

router.route("/get/allGh").get(getAllGh);


export default router;