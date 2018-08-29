'use strict';
module.exports = (sequelize, DataTypes) => {
  var mapsBikes = sequelize.define('mapsBikes', {
    mapId: DataTypes.INTEGER,
    bikeId: DataTypes.INTEGER
  }, {});
  mapsBikes.associate = function(models) {
    // associations can be defined here
  };
  return mapsBikes;
};