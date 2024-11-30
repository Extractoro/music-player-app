import express from "express";
import upload from "../utils/multer-config.js";
import controllers from "../controllers/index.js";
import {adminMiddleware} from "../utils/adminMiddleware.js";
import {authMiddleware} from "../utils/authMiddleware.js";

const router = express.Router();

// router.use(authMiddleware)

router.get("/all-albums", controllers.getAllAlbumsController);

router.get("/get-album/:id", controllers.getAlbumByIdController);

router.use(adminMiddleware)

router.post("/add-album", upload.single("photo"), controllers.addAlbumController);

router.put("/update-album/:id", controllers.updateAlbumController);

router.delete("/delete-album/:id", controllers.deleteAlbumController);

export default router;