import { Router } from "express";

import authController from "./auth.controller";
import { limiter } from "../../common/middlewares/rate-limit.middleware";
import { Validation } from "../../common/middlewares/validation.middleware";
import * as v from "./auth.validation";

const router = Router();

router.post(
    "/register",
    Validation(v.registerSchema),
    limiter(10, 3, "Too many register attempts, please try again later"),
    authController.register,
);

router.post(
    "/login",
    Validation(v.loginSchema),
    limiter(10, 3, "Too many login attempts, please try again later"),
    authController.login,
);

router.post(
    "/verify",
    Validation(v.verifyEmailSchema),
    limiter(10, 3, "Too many attempts, please try again later"),
    authController.verifyEmail,
);

router.get("/rr", authController.returnAll);

export default router;
