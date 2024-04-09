import { ValidationChain, body, validationResult } from "express-validator";

export const validateBook: ValidationChain[] = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required"),
  body("yearPublished") // Assuming this is meant to be the same as publishYear
    .isNumeric()
    .withMessage("Publish Year must be a number")
    .optional({ checkFalsy: true }), // Mark as optional but validate if provided
  body("genre") // Adding genre validation if necessary
    .isString()
    .withMessage("Genre must be a string")
    .notEmpty()
    .withMessage("Genre is required"),
  // If you also need to validate author, ensure it's correctly represented in your interface and data model
  body().custom((value: any, { req, res, next }: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }),
];
