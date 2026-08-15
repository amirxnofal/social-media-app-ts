import { type Request, type Response } from "express";
import authService from "./auth.service";

class AuthController {
    async register(req: Request, res: Response) {
        const result = await authService.register(req.body);
        res.status(200).json({
            success: true,
            message: "Successfull registeration",
            data: result,
        });
    }
    async returnAll(req: Request, res: Response) {
        const result = await authService.returnAll();
        res.status(200).json({
            success: true,
            message: "Successfull registeration",
            data: result,
        });
    }
}

export default new AuthController();
