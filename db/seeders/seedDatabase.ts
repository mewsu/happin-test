// seedDatabase.ts

import { sequelize, Author, Book } from '../../src/models/index';

const seedDatabase = async () => {
  // Ensure models are synced before seeding
  await sequelize.sync(); // Use `{ force: true }` with caution

  // Create tables if they do not exist
  await Author.sync();
  await Book.sync();

  // Clear existing data
  await Author.destroy({ where: {} });
  await Book.destroy({ where: {} });

  // Seed logic here
  // Generate authors
  const authors = await Author.bulkCreate([
    { name: 'J.K. Rowling', born: new Date('1965-07-31'), city: 'Yate, Gloucestershire, England' },
    { name: 'Stephen King', born: new Date('1947-09-21'), city: 'Portland, Maine, USA' },
    { name: 'Mark Twain', born: new Date('1835-11-30'), city: 'Florida, Missouri, USA' },
    { name: 'Jane Austen', born: new Date('1775-12-16'), city: 'Steventon, Hampshire, England'},
    { name: 'J.D. Salinger', born: new Date('1919-01-01'), city: 'New York City, New York, USA' },
    { name: 'F. Scott Fitzgerald', born: new Date('1896-09-24'), city: 'St. Paul, Minnesota, USA' },
    { name: 'Herman Melville', born: new Date('1819-08-01'), city: 'New York City, New York, USA'}

  ]);

  // Generate books
  await Book.bulkCreate([
    { title: 'Harry Potter and the Philosopher\'s Stone', authorId: authors[0].id, yearPublished: 1997, genre: 'Fantasy' },
    { title: 'It', authorId: authors[1].id, yearPublished: 1986, genre: 'Horror' },
    { title: 'The Adventures of Tom Sawyer', authorId: authors[2].id, yearPublished: 1876, genre: 'Adventure' },
    { title: 'Pride and Prejudice', authorId: authors[3].id, yearPublished: 1813, genre: 'Romance' },
    { title: 'The Catcher in the Rye', authorId: authors[4].id, yearPublished: 1951, genre: 'Realistic Fiction' },
    { title: 'The Great Gatsby', authorId: authors[5].id, yearPublished: 1925, genre: 'Tragedy' },
    { title: 'Moby-Dick', authorId: authors[6].id, yearPublished: 1851, genre: 'Fiction'}
  ]);

};

seedDatabase().then(() => console.log('Seeding complete.')).catch((error) => console.error('Seeding failed:', error));
