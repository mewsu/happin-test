'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Books', [{
      title: 'The Great Adventure',
      authorId: 1, // Assuming this matches an existing author
      yearPublished: 2020,
      genre: 'Adventure',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'Science 101',
      authorId: 2, // Assuming this matches another existing author
      yearPublished: 2021,
      genre: 'Education',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
  }
};
