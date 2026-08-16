import { type NextFunction, type Request, type Response } from "express";
import authService from "./auth.service";
import { SuccessResponse } from "../../common";
import * as error from "../../common";
import {
    ForgetPasswordDto,
    LoginDto,
    RegisterDto,
    ResendOtpDto,
    ResetPasswordDto,
    VerifyEmailDto,
} from "./auth.validation";

class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const data: RegisterDto = req.body;
            const result = await authService.register(data);
            SuccessResponse({
                res,
                statusCode: 200,
                message: "Successful registration",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const data: LoginDto = req.body;

            const result = await authService.login(data, req.get("host"));
            SuccessResponse({
                res,
                statusCode: 200,
                message: "Login success",
                token: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const data: VerifyEmailDto = req.body;

            await authService.verifyEmail(data);
            SuccessResponse({
                res,
                statusCode: 200,
                message: "Email verified",
            });
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.newAccessToken) {
                return next(
                    new error.UnauthorizedException("Failed to refresh token"),
                );
            }
            SuccessResponse({
                res,
                statusCode: 200,
                message: "Token refreshed",
                token: { accessToken: req.newAccessToken },
            });
        } catch (error) {
            next(error);
        }
    }

    async resendOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const data: ResendOtpDto = req.body;
            await authService.resendOtp(data);

            SuccessResponse({
                res,
                statusCode: 200,
                message: "OTP sent",
            });
        } catch (error) {
            next(error);
        }
    }

    async forgetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const data: ForgetPasswordDto = req.body;
            await authService.forgetPassword(data);

            SuccessResponse({
                res,
                statusCode: 200,
                message: "OTP sent",
            });
        } catch (error) {
            next(error);
        }
    }
    
    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const data: ResetPasswordDto = req.body;
            await authService.resetPassword(data);

            SuccessResponse({
                res,
                statusCode: 200,
                message: "Password reseted",
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
