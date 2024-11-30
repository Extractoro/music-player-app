import express from "express";
import controllers from "../controllers/index.js";
import {authMiddleware} from "../utils/authMiddleware.js";

const router = express.Router();

// router.use(authMiddleware)

router.post("/create-playlist", controllers.createPlaylistController);

router.get("/user-playlists/:id", controllers.getUserPlaylistsController);

router.post("/:id/songs", controllers.addSongToPlaylistController);

router.delete("/:id/songs/:songId", controllers.removeSongFromPlaylistController);

router.delete("/:id", controllers.deletePlaylistController);

export default router;