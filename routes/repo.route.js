import { Router } from "express";
import {  getAllRepoFromGhApi, getAlreadySelectedRepos, postSelectedAndRemoveUnseclectedRepos } from "../controllers/repo.controller.js";
import { requireAuth } from "@clerk/express";
const router = Router();

router.route("/get/allrepofromghapi").get(getAllRepoFromGhApi);
router.route("/get/allselectedrepo").get(getAlreadySelectedRepos);
router.route("/post/saveremoverepo").post(postSelectedAndRemoveUnseclectedRepos);


export default router;