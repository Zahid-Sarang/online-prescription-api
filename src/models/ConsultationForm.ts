import mongoose, { Document, Schema, Model } from "mongoose";

interface IConsultationForm extends Document {
    patientId: mongoose.Schema.Types.ObjectId;
    doctorId: mongoose.Schema.Types.ObjectId;
    currentIllnessHistory: string;
    recentSurgery: {
        description: string;
        timeSpan: string;
    };
    familyMedicalHistory: {
        diabetes: string;
        allergies: string;
        others?: string;
    };
    prescription?: {
        careToBeTaken: string;
        medicines: string;
    };
}

const consultationFormSchema: Schema<IConsultationForm> = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        doctorId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        currentIllnessHistory: {
            type: String,
            required: true,
        },
        recentSurgery: {
            description: {
                type: String,
                required: true,
            },
            timeSpan: {
                type: String,
                required: true,
            },
        },
        familyMedicalHistory: {
            diabetes: {
                type: String,
                required: true,
                enum: ["Diabetic", "Non-Diabetic"],
            },
            allergies: {
                type: String,
                required: true,
            },
            others: {
                type: String,
            },
        },
        prescription: {
            careToBeTaken: {
                type: String,
            },
            medicines: {
                type: String,
            },
        },
    },
    {
        timestamps: true,
    },
);

const ConsultationForm: Model<IConsultationForm> =
    mongoose.model<IConsultationForm>(
        "ConsultationForm",
        consultationFormSchema,
    );

export default ConsultationForm;
