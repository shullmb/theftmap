'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.changeColumn('maps','id',{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      }),
      queryInterface.changeColumn('mapsBikes', 'mapId', {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      })
  ]
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('maps', 'id', {
      type: Sequelize.Integer,
      primaryKey: true,
      allowNull: false
    })
  }
};
