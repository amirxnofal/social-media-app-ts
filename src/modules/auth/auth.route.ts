import { Router } from "express";

import authController from "./auth.controller";
import { limiter } from "../../common/middlewares/rate-limit.middleware";
import { Validation } from "../../common/middlewares/validation.middleware";
import * as v from "./auth.validation";

const router = Router();

router.post(
    "/register",
    Validation(v.registerSchema),
    limiter(10, 5, "Too many register attempts, please try again later"),
    authController.register,
);
router.get("/rr", authController.returnAll);

export default router;
