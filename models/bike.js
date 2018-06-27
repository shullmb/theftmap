'use strict';
module.exports = (sequelize, DataTypes) => {
  var bike = sequelize.define('bike', {
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    model: DataTypes.STRING
  }, {});
  bike.associate = function(models) {
    // associations can be defined here
  };
  return bike;
};