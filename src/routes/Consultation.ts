import express, { Request, Response, NextFunction } from "express";
import authenticate from "../middleware/authenticate";
import { ConsultationController } from "../controllers/ConsultationController";
import { ConsultationService } from "../services/Consultation";

const router = express.Router();
const consultationService = new ConsultationService();
const consultationContoller = new ConsultationController(consultationService);

router.post(
    "/",
    authenticate,
    (req: Request, res: Response, next: NextFunction) =>
        consultationContoller.create(req, res, next),
);

export default router;
