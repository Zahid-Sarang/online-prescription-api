import { body } from "express-validator";

export default [
    body("profilePicture").custom((value, { req }) => {
        if (!req.files) throw new Error("Product image is required");
        return true;
    }),
    body("name")
        .exists()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name should be a string"),
    body("specialty")
        .if(body("role").equals("doctor"))
        .exists()
        .withMessage("Specialty is required for doctors")
        .isString()
        .withMessage("Specialty should be a string"),
    body("email")
        .exists()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("phoneNumber")
        .exists()
        .withMessage("Phone number is required")
        .isString()
        .withMessage("Phone number should be a string")
        .matches(/^\d{10}$/)
        .withMessage("Phone number should be a 10 digit number"),
    body("yearsOfExperience")
        .if(body("role").equals("doctor"))
        .exists()
        .withMessage("Years of experience is required for doctors")
        .isDecimal()
        .withMessage("Years of experience should be a decimal value")
        .isFloat({ min: 0 })
        .withMessage("Years of experience should be a positive number"),
    body("age")
        .if(body("role").equals("patient"))
        .exists()
        .withMessage("Age is required for patients")
        .isInt({ min: 0 })
        .withMessage("Age should be a positive integer"),
    body("historyOfSurgery")
        .if(body("role").equals("patient"))
        .exists()
        .withMessage("History of surgery is required for patients")
        .isString()
        .withMessage("History of surgery should be a string"),
    body("historyOfIllness")
        .if(body("role").equals("patient"))
        .exists()
        .withMessage("History of illness is required for patients")
        .isString()
        .withMessage("History of illness should be a string"),
    body("role")
        .exists()
        .withMessage("Role is required")
        .isIn(["doctor", "patient"])
        .withMessage("Role should be either 'doctor' or 'patient'"),
    body("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password should be a string")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long"),
];
