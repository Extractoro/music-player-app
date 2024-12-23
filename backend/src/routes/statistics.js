import express from "express";
import controllers from "../controllers/index.js";

const router = express.Router();

router.get("/top-songs", controllers.getTopSongsController);

router.get("/popular-genres", controllers.getPopularGenresController);

export default router;