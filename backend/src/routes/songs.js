import express from "express";
import controllers from "../controllers/index.js";
import {adminMiddleware} from "../utils/adminMiddleware.js";
import upload from "../utils/multer-config.js";
import {authMiddleware} from "../utils/authMiddleware.js";

const router = express.Router();

// router.use(authMiddleware)

router.get("/all-songs", controllers.getAllSongsController);

router.get("/get-song/:id", controllers.getSongByIdController);

// router.use(adminMiddleware)

router.post("/add-song", upload.single("photo"), controllers.addSongController);

router.put("/update-song/:id", controllers.updateSongController);

router.delete("/delete-song/:id", controllers.deleteSongController);

export default router;