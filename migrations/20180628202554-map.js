'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('maps', 'lat', Sequelize.FLOAT),
      queryInterface.addColumn('maps', 'lng', Sequelize.FLOAT)
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('maps', 'lat'),
      queryInterface.removeColumn('maps', 'lng')
    ]
  }
};
