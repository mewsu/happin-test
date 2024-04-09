// Define models
import { Sequelize, Model, DataTypes, Association, Op } from "sequelize";
import { Author } from "./author";
import { Book } from "./book";
interface BookCreateRequest {
  title: string;
  yearPublished: number;
  genre: string;
}

// Initialize your Sequelize connection
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data/development.sqlite", // Update this path as needed
});

// Associations
Author.hasMany(Book, { sourceKey: "id", foreignKey: "authorId", as: "books" });

Book.belongsTo(Author, {
  targetKey: "id",
  foreignKey: "authorId",
  as: "author",
});

export { Author, Book, sequelize, BookCreateRequest };