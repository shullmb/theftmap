'use strict';
module.exports = (sequelize, DataTypes) => {
  var map = sequelize.define('map', {
    location: DataTypes.STRING,
    radius: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  map.associate = function(models) {
    // associations can be defined here
  };
  return map;
};