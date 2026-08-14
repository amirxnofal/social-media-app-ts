import { Router } from "express";
import authController from "./auth.controller";
import { limiter } from "../../common/middlewares/rate-limit.middleware";
import { Validation } from "../../common/middlewares/validation.middleware";
import { loginSchema } from "./auth.validation";

const router = Router();

router.post(
    "/",
    Validation(loginSchema),
    limiter(10, 5, "Too many login attempts, please try again later"),
    authController.getAllUsers,
);

export default router;
