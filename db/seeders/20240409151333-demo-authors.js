'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Authors', [{
      name: 'John Doe',
      born: '1990-01-01',
      city: 'New York',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Jane Doe',
      born: '1992-02-01',
      city: 'Toronto',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Authors', null, {});
  }
};
