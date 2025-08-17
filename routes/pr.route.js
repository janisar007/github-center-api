import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { reviewPR } from "../controllers/pr.controller.js";
const router = Router();

router.route("/get/review").get(reviewPR);

export default router;
