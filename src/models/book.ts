import { Sequelize, Model, DataTypes, Association, Op } from "sequelize";
import { Author } from "./author";

// Initialize your Sequelize connection
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data/development.sqlite",
});

// Define the Book model
class Book extends Model {
  declare id: number;
  declare title: string;
  declare authorId: number;
  declare yearPublished: number;
  declare genre: string;

  declare static associations: {
    author: Association<Book, Author>;
  };
}

Book.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    authorId: {
      type: DataTypes.INTEGER,
      references: { model: "Authors", key: "id" },
    },
    yearPublished: { type: DataTypes.INTEGER },
    genre: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Book",
  }
);


export { Book };
