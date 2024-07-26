import ConsultationForm from "../models/ConsultationForm";
import { Consultation } from "../types";

export class ConsultationService {
    constructor() {}

    async create(consultation: Consultation) {
        return await ConsultationForm.create(consultation);
    }

    async getConsultationsByDoctor(doctorId: string) {
        return await ConsultationForm.find({ doctorId }).populate("patientId");
    }

    async getConsultationsById(consultId: string) {
        return await ConsultationForm.findById(consultId).populate("patientId");
    }
}
