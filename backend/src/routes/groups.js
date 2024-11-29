import express from "express";
import controllers from "../controllers/index.js";

const router = express.Router();

router.post("/:groupId/add-artists", controllers.addArtistToGroupController);

router.delete("/:groupId/delete-artists/:artistId", controllers.removeArtistFromGroupController);

export default router;