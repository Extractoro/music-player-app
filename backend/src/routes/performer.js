import express from "express";
import controllers from "../controllers/index.js";
import upload from "../utils/multer-config.js";
import {adminMiddleware} from "../utils/adminMiddleware.js";
import {authMiddleware} from "../utils/authMiddleware.js";

const router = express.Router();

// router.use(authMiddleware)

router.get("/all-performers", controllers.getPerformersController);

router.get("/get-performer/:id", controllers.getPerformerByIdController);

// router.use(adminMiddleware)

router.post("/add-performer", upload.single("photo"), controllers.addPerformerController);

router.put("/update-performer/:id", upload.single("photo"), controllers.updatePerformerController);

router.delete("/delete-performer/:id", controllers.deletePerformerController);

export default router;