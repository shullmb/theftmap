'use strict';
module.exports = (sequelize, DataTypes) => {
  var bike = sequelize.define('bike', {
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    model: DataTypes.STRING,
    bikeIndexId: DataTypes.INTEGER
  }, {});
  bike.associate = function(models) {
    models.bike.belongsToMany(models.map, {through: "mapsBikes"});
  };
  return bike;
};