import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { createGroupandAddRepo, deleteGroup, getAllGroups, updateGroup } from "../controllers/group.controller.js";
const router = Router();

router.route("/get/allgroups").get(getAllGroups);
router.route("/post/creategroupandAddRepo").post(createGroupandAddRepo);
router.route("/put/groups").put(updateGroup);
router.route("/delete/allgroups").delete(deleteGroup);


export default router;