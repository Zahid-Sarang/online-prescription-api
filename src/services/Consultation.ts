import ConsultationForm from "../models/ConsultationForm";
import { Consultation } from "../types";

export class ConsultationService {
    constructor() {}

    async create(consultation: Consultation) {
        return await ConsultationForm.create(consultation);
    }
}
