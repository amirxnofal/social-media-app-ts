import { type Request, type Response } from "express";
import authService from "./auth.service";

class AuthController {
    async getAllUsers(req: Request, res: Response) {
        const result = await authService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users retrived successfully",
            data: result,
        });
    }
}

export default new AuthController();
