'use strict';
module.exports = (sequelize, DataTypes) => {
  var map = sequelize.define('map', {
    location: DataTypes.STRING,
    radius: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  map.associate = function(models) {
    models.map.belongsTo(models.user);
    models.map.belongsToMany(models.bike, {through: "mapsBikes"})
  };
  return map;
};