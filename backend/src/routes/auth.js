import express from "express";
import controllers from "../controllers/index.js";
import {authMiddleware} from "../utils/authMiddleware.js";
const router = express.Router();

router.post("/registration", controllers.signupController);

router.get("/verify-email", controllers.verifyEmailController);

router.post("/request-password-reset", controllers.requestPasswordResetController);

router.post("/reset-password", controllers.resetPasswordController);

router.post("/login", controllers.loginController);

router.use(authMiddleware);

router.get("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

router.get('/current/:id', controllers.getCurrentUserController)

export default router;