import { Router } from "express";
import {  getAllRepoFromGhApi, getAlreadySelectedRepos, getRepoPrWorkflowInfo, postSelectedAndRemoveUnseclectedRepos } from "../controllers/repo.controller.js";
import { requireAuth } from "@clerk/express";
const router = Router();

router.route("/get/allrepofromghapi").get(getAllRepoFromGhApi);
router.route("/get/allselectedrepo").get(getAlreadySelectedRepos);
router.route("/post/saveremoverepo").post(postSelectedAndRemoveUnseclectedRepos);

//it is a post request but it only fethces data from db. post is used because there is a req.body->
router.route("/get/repoprworkflowinfo").post(getRepoPrWorkflowInfo);


export default router;