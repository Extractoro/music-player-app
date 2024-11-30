import express from "express";
import controllers from "../controllers/index.js";
import {adminMiddleware} from "../utils/adminMiddleware.js";
import {authMiddleware} from "../utils/authMiddleware.js";

const router = express.Router();

// router.use(authMiddleware)
// router.use(adminMiddleware)

router.post("/:groupId/add-artists", controllers.addArtistToGroupController);

router.delete("/:groupId/delete-artists/:artistId", controllers.removeArtistFromGroupController);

export default router;