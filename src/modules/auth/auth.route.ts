// import { Router } from "express";

// import authController from "./auth.controller";
// import * as v from "./auth.validation";
// import { limiter, refreshAuth, Validation } from "../../common";

// const router = Router();

// router.post(
//     "/register",
//     Validation(v.registerSchema),
//     limiter(10, 3, "Too many register attempts, please try again later"),
//     authController.register,
// );

// router.post(
//     "/login",
//     Validation(v.loginSchema),
//     limiter(10, 3, "Too many login attempts, please try again later"),
//     authController.login,
// );

// router.post(
//     "/verify",
//     Validation(v.verifyEmailSchema),
//     limiter(10, 3, "Too many attempts, please try again later"),
//     authController.verifyEmail,
// );

// router.post("/refresh-token", refreshAuth, authController.refreshToken);

// router.post(
//     "/resend-otp",
//     limiter(10, 3, "Too many attempts, please try again later"),
//     Validation(v.resendOtpSchema),
//     authController.resendOtp,
// );

// router.post(
//     "/forgot-password",
//     limiter(10, 3, "Too many attempts, please try again later"),
//     Validation(v.forgetPasswordSchema),
//     authController.forgetPassword,
// );

// router.post(
//     "/reset-password",
//     limiter(10, 3, "Too many attempts, please try again later"),
//     Validation(v.resetPasswordSchema),
//     authController.resetPassword,
// );

// export default router;
