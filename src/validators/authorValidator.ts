import { ValidationChain, body, validationResult } from "express-validator";

export const validateAuthor: ValidationChain[] = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),
  body("born")
    .isDate()
    .withMessage("Born must be a date")
    .optional({ checkFalsy: true }), // Mark as optional but validate if provided
  body("city")
    .isString()
    .withMessage("City must be a string")
    .notEmpty()
    .withMessage("City is required"),
  // If you also need to validate books, ensure it's correctly represented in your interface and data model
  body().custom((value: any, { req, res, next }: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
];