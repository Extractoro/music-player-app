import express from "express";
import controllers from "../controllers/index.js";

const router = express.Router();

router.post("/add-song", controllers.addSongController);

router.get("/all-songs", controllers.getAllSongsController);

router.get("/get-song/:id", controllers.getSongByIdController);

router.put("/update-song/:id", controllers.updateSongController);

router.delete("/delete-song/:id", controllers.deleteSongController);

export default router;