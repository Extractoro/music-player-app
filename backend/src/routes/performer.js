import express from "express";
import controllers from "../controllers/index.js";
import upload from "../utils/multer-config.js";

const router = express.Router();

router.post("/add-performer", upload.single("photo"), controllers.addPerformerController);

router.get("/all-performers", controllers.getPerformersController);

router.get("/get-performer/:id", controllers.getPerformerByIdController);

router.put("/update-performer/:id", controllers.updatePerformerController);

router.delete("/delete-performer/:id", controllers.deletePerformerController);

export default router;