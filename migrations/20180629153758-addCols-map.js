'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('maps', 'title', Sequelize.STRING),
      queryInterface.addColumn('maps', 'description', Sequelize.TEXT),
      queryInterface.addColumn('maps', 'public', Sequelize.BOOLEAN)
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('maps', 'title'),
      queryInterface.removeColumn('maps', 'description'),
      queryInterface.removeColumn('maps', 'public')
    ]
  }
};
