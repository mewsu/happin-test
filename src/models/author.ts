import { Sequelize, Model, DataTypes, Association, Op } from "sequelize";
import { Book } from "./book";

// Initialize Sequelize connection
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data/development.sqlite", // Update this path as needed
});

// Define the Author model
class Author extends Model {
  declare id: number;
  declare name: string;
  declare born: Date;
  declare city: string;

  declare static associations: {
    books: Association<Author, Book>;
  };
}

Author.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    born: { type: DataTypes.DATEONLY },
    city: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "Author",
  }
);



export { Author };
