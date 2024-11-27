import express from "express";
import controllers from "../controllers/index.js";
import upload from "../utils/multer-config.js";

const router = express.Router();

router.post("/add-performer", upload.single("photo"), controllers.addPerformerController);

router.get("/all-performers", controllers.getPerformersController);

export default router;