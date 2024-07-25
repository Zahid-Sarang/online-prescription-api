import { checkSchema } from "express-validator";

export default checkSchema({
    date: {
        trim: true,
        errorMessage: "Date is required!",
        notEmpty: true,
    },
    instructor: {
        trim: true,
        errorMessage: "instructor is required!",
        notEmpty: true,
    },
    course: {
        trim: true,
        errorMessage: "course name is required!",
        notEmpty: true,
    },
});
