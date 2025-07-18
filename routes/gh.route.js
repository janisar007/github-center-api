import { Router } from "express";
import { getAllRepo } from "../controllers/repo.controller.js";
import { requireAuth } from "@clerk/express";
import { getAllGh } from "../controllers/gh.controller.js";
const router = Router();

router.route("/get/allGh").get(getAllGh);
// router.route("/get/sigleGH").get(getAllRepo);


export default router;