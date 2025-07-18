import { Router } from "express";
import { getAllRepo } from "../controllers/repo.controller.js";
import { requireAuth } from "@clerk/express";
const router = Router();

router.route("/getallrepo").get( getAllRepo)


export default router;