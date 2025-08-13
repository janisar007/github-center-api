import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { createGroupandAddRepo, deleteGroup, getAllGroups, removeRepoFromGroup, updateGroup } from "../controllers/group.controller.js";
const router = Router();

router.route("/get/allgroups").get(getAllGroups);
router.route("/post/creategroupandaddrepo").post(createGroupandAddRepo);
router.route("/put/group").put(updateGroup); 
router.route("/delete/group").delete(deleteGroup);
router.route("/remove/fromgroup").put(removeRepoFromGroup);


export default router;