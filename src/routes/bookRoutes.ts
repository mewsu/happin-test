/**
 * Express router for book endpoints.
 * @module bookRoutes
 */

const express = require("express");
const router = express.Router();
const { validateBook } = require("../validators/bookValidator");
import { Book, Author } from "../models";
import { Request, Response } from "express";
import { Op } from "sequelize";
const authMiddleware = require("../middlewares/authMiddleware");

// Book endpoints

/**
 * Get all books.
 * @name GET /books
 * @function
 * @async
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} The response object with the list of books.
 */
router.get("/books", async (req: Request, res: Response): Promise<Response> => {
    try {
        const books = await Book.findAll();
        return res.json(books);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

/**
 * Get all books by authors born in a specific city within a range of years.
 * @name GET /books/city/:city
 * @function
 * @async
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} The response object with the list of books.
 */
router.get(
    "/books/city/:city",
    async (req: Request, res: Response): Promise<Response> => {
        const city: string = req.params.city;
        const startYear: string = String(req.query.startYear) || "";
        const endYear: string = String(req.query.endYear) || "";

        // Define whereClause with an index signature to allow dynamic property names with string keys
        let whereClause: { [key: string]: any } = {};

        // Attempt to parse startYear and endYear and add to whereClause if both are valid numbers
        const parsedStartYear = parseInt(startYear);
        const parsedEndYear = parseInt(endYear);
        if (!isNaN(parsedStartYear) && !isNaN(parsedEndYear)) {
            whereClause.yearPublished = {
                [Op.gte]: parsedStartYear,
                [Op.lte]: parsedEndYear,
            };
        }

        try {
            const books = await Book.findAll({
                where: whereClause,
                include: [
                    {
                        model: Author,
                        as: "author",
                        where: {
                            city: {
                                [Op.like]: `%${city}%`,
                            },
                        },
                    },
                ],
            });

            return res.json(books);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
);

/**
 * Delete a book.
 * @name DELETE /books/:id
 * @function
 * @async
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} The response object.
 */
router.delete(
    "/books/:id",
    authMiddleware,
    async (req: Request, res: Response): Promise<Response> => {
        const id: string = req.params.id;

        try {
            const book = await Book.findByPk(id);
            if (!book) {
                return res.status(404).send("Book not found");
            }

            await book.destroy();
            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
);

/**
 * Create a book.
 * @name POST /books
 * @function
 * @async
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} The response object with the created book.
 */
router.post(
    "/books",
    authMiddleware,
    validateBook,
    async (req: Request, res: Response): Promise<Response> => {
        const { title, authorId, yearPublished, genre } = req.body;

        try {
            const book = await Book.create({
                title,
                authorId,
                yearPublished,
                genre,
            });

            return res.status(201).json(book);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;
