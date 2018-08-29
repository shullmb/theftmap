'use strict';
module.exports = (sequelize, DataTypes) => {
  var mapsBikes = sequelize.define('mapsBikes', {
    mapId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    bikeId: DataTypes.INTEGER
  }, {});
  mapsBikes.associate = function(models) {
    // associations can be defined here
  };
  return mapsBikes;
};