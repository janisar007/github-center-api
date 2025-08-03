import { Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  getPatDetails,
  renamePat,
  savePat,
  updatePat,
} from "../controllers/pat.controller.js";
const router = Router();

router.route("/create/pat").post(savePat);
router.route("/get/patDetails").get(getPatDetails);
router.route("/update/pat").put(updatePat);
router.route("/rename/patname").put(renamePat);

export default router;
