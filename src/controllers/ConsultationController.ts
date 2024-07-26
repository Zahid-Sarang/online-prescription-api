import { NextFunction, Response } from "express";
import { ConsultationRequest } from "../types";
import { ConsultationService } from "../services/Consultation";

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
}
