import { checkSchema } from "express-validator";

export default checkSchema({
    name: {
        trim: true,
        errorMessage: "Name is required!",
        notEmpty: true,
    },
    level: {
        trim: true,
        errorMessage: "Level name is required!",
        notEmpty: true,
    },
    description: {
        trim: true,
        errorMessage: "Description name is required!",
        notEmpty: true,
    },
});
