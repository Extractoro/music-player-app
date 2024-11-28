import express from "express";
import upload from "../utils/multer-config.js";
import controllers from "../controllers/index.js";

const router = express.Router();

router.post("/add-album", upload.single("photo"), controllers.addAlbumController);

router.get("/all-albums", controllers.getAllAlbumsController);

router.get("/get-album/:id", controllers.getAlbumByIdController);

router.put("/update-album/:id", controllers.updateAlbumController);

router.delete("/delete-album/:id", controllers.deleteAlbumController);

export default router;