'use strict';
const NodeGeocoder = require('node-geocoder');
const geoOptions = {
  provider: 'google',
  apiKey: process.env.MAPS_KEY
}

const geocoder = NodeGeocoder(geoOptions);

module.exports = (sequelize, DataTypes) => {
  var map = sequelize.define('map', {
    location: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    radius: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (pendingMap, options) => {
        geocoder.geocode(pendingMap.location).then((results) => {
          pendingMap.lat = results[0].latitude;
          pendingMap.lng = results[0].longitude;
          pendingMap.save();
        }).catch((err) => {
          console.log(err);
        })
      }
    }
  });
  map.associate = function(models) {
    models.map.belongsTo(models.user);
    models.map.belongsToMany(models.bike, {through: "mapsBikes"})
  };
  return map;
};