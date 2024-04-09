/**
 * Express router for author endpoints.
 * @module authorRoutes
 */

const express = require("express");
const router = express.Router();
const { validateBook } = require("../validators/bookValidator");
import { Book, Author } from "../models";
import { Request, Response } from "express";
import { Op } from "sequelize";
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * Get all authors.
 * @route GET /authors
 * @group authors - Operations about authors
 * @returns {object} 200 - An array of authors
 * @returns {Error}  500 - Unexpected error
 * @description Retrieves a list of all authors from the database.
 */
router.get(
    "/authors",
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const authors = await Author.findAll();
            return res.json(authors);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
);

/**
 * Get all authors born in a specific city.
 * @route GET /authors/city/{city}
 * @group authors - Operations about authors
 * @param {string} city.path.required - The city name
 * @returns {object} 200 - An array of authors
 * @returns {Error}  500 - Unexpected error
 * @description Retrieves a list of all authors born in a specific city from the database.
 */
router.get(
    "/authors/city/:city",
    async (req: Request, res: Response): Promise<Response> => {
        const city: string = req.params.city;

        try {
            const authors = await Author.findAll({
                where: {
                    city: {
                        [Op.like]: `%${city}%`,
                    },
                },
            });

            return res.json(authors);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
);

/**
 * Get a specific author.
 * @route GET /authors/{id}
 * @group authors - Operations about authors
 * @param {string} id.path.required - The author ID
 * @returns {object} 200 - The author object
 * @returns {Error}  404 - Author not found
 * @returns {Error}  500 - Unexpected error
 * @description Retrieves a specific author from the database.
 */
router.get(
    "/authors/:id",
    async (req: Request, res: Response): Promise<Response> => {
        const id: string = req.params.id;

        try {
            const author = await Author.findByPk(id);
            if (!author) {
                return res.status(404).send("Author not found");
            }

            return res.json(author);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
);

/**
 * Get all books by a specific author.
 * @route GET /authors/{id}/books
 * @group authors - Operations about authors
 * @param {string} id.path.required - The author ID
 * @returns {object} 200 - An array of books
 * @returns {Error}  404 - Author not found
 * @returns {Error}  500 - Unexpected error
 * @description Retrieves all books written by a specific author from the database.
 */
router.get(
    "/authors/:id/books",
    async (req: Request, res: Response): Promise<Response> => {
        const id: string = req.params.id;

        try {
            const author = await Author.findByPk(id, {
                include: [
                    {
                        model: Book,
                        as: "books",
                    },
                ],
            });

            if (!author) {
                return res.status(404).send("Author not found");
            }

            return res.json((author as Author & { books: Book[] }).books);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
);

/**
 * Add a new author.
 * @route POST /authors
 * @group authors - Operations about authors
 * @param {string} name.body.required - The name of the author
 * @param {Date} born.body.required - The birth date of the author
 * @param {string} city.body.required - The city of the author
 * @returns {object} 201 - The newly created author object
 * @returns {Error}  500 - Unexpected error
 * @description Adds a new author to the database.
 */
router.post(
    "/authors",
    authMiddleware,
    async (
        req: Request<{}, {}, { name: string; born: Date; city: string }>,
        res: Response
    ) => {
        const { name, born, city } = req.body;

        try {
            const newAuthor = await Author.create({ name, born, city });
            return res.status(201).json(newAuthor);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
);

/**
 * Update an author.
 * @route PUT /authors/{id}
 * @group authors - Operations about authors
 * @param {string} id.path.required - The author ID
 * @returns {object} 200 - The updated author object
 * @returns {Error}  404 - Author not found
 * @returns {Error}  500 - Unexpected error
 * @description Updates an existing author in the database.
 */
router.put(
    "/authors/:id",
    authMiddleware,
    async (req: Request, res: Response): Promise<Response> => {
        const id: string = req.params.id;
        const updates: Partial<Author> = req.body;

        try {
            const author = await Author.findByPk(id);
            if (!author) {
                return res.status(404).send("Author not found");
            }

            const updatedAuthor = await author.update(updates);
            return res.json(updatedAuthor);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
);

/**
 * Add a new book by an author.
 * @route POST /authors/{id}/books
 * @group authors - Operations about authors
 * @param {string} id.path.required - The author ID
 * @param {string} title.body.required - The title of the book
 * @param {number} yearPublished.body.required - The year the book was published
 * @param {string} genre.body.required - The genre of the book
 * @returns {object} 201 - The newly created book object
 * @returns {Error}  404 - Author not found
 * @returns {Error}  500 - Unexpected error
 * @description Adds a new book written by an author to the database.
 */
router.post(
    "/authors/:id/books",
    authMiddleware,
    validateBook,
    async (req: Request, res: Response): Promise<Response> => {
        const id: string = req.params.id as string;
        const { title, yearPublished, genre } = req.body;

        try {
            const author = await Author.findByPk(id);
            if (!author) {
                return res.status(404).send("Author not found");
            }

            const newBook = await Book.create({
                title,
                yearPublished,
                genre,
                authorId: author.id,
            });

            return res.status(201).json(newBook);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;
