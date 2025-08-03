import { Router } from "express";
import { requireAuth } from "@clerk/express";
import {
  getAllGh,
  getGithubAccountDetails,
  removeGithubAccount,
  resetGithubAccount,
} from "../controllers/gh.controller.js";
const router = Router();

router.route("/get/allGh").get(getAllGh);
router.route("/get/ghaccountdetails").get(getGithubAccountDetails);
router.route("/remove/ghaccount").delete(removeGithubAccount);
router.route("/reset/ghaccount").delete(resetGithubAccount);

export default router;
