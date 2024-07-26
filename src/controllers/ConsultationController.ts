import { NextFunction, Response } from "express";
import { AuthRequest, ConsultationRequest } from "../types";
import { ConsultationService } from "../services/Consultation";
import createHttpError from "http-errors";

export class ConsultationController {
    constructor(private consultationService: ConsultationService) {}

    async create(req: ConsultationRequest, res: Response, next: NextFunction) {
        try {
            const {
                patientId,
                doctorId,
                currentIllnessHistory,
                recentSurgery,
                familyMedicalHistory,
            } = req.body;
            // Validate the consultationData object here if necessary

            if (
                !patientId ||
                !doctorId ||
                !currentIllnessHistory ||
                !recentSurgery ||
                !familyMedicalHistory
            ) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields" });
            }

            const consultation = {
                patientId,
                doctorId,
                currentIllnessHistory,
                recentSurgery,
                familyMedicalHistory,
            };

            const newConsultation =
                await this.consultationService.create(consultation);

            res.json(newConsultation);
        } catch (err) {
            next(err);
        }
    }

    async getConsultation(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { role, sub: doctorId } = req.auth;

            if (role === "patient") {
                return next(
                    createHttpError(
                        403,
                        "You do not have permission to access this data.",
                    ),
                );
            }

            const consultationData =
                await this.consultationService.getConsultation(doctorId);
            res.json(consultationData);
        } catch (err) {
            next(err);
        }
    }
}
