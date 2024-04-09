const express = require("express");
const router = express.Router();
const { validateBook } = require("../validators/bookValidator");
import { Book, Author } from "../models";
import { Request, Response } from "express";
import { Op } from "sequelize";
const authMiddleware = require("../middlewares/authMiddleware");

// Author endpoints
// Get all authors
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

// Get all authors born in a specific city
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

// Get a specific author
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

// Get all books by a specific author
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

// Add a new author
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

// Update an author
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

// Add a new book by an author
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
