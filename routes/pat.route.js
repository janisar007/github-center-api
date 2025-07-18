import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { savePat } from "../controllers/pat.controller.js";
const router = Router();

router.route("/create/pat").post( savePat) 


export default router;