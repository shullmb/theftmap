'use strict';
const NodeGeocoder = require('node-geocoder');
const geoOptions = {provider: 'google'};

const geocoder = NodeGeocoder(geoOptions);

module.exports = (sequelize, DataTypes) => {
  var map = sequelize.define('map', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    location: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    radius: DataTypes.INTEGER,
    title: { 
      type: DataTypes.STRING,
      validate: {
        len: [1, 12]
      }
    },
    description: DataTypes.TEXT,
    public: DataTypes.BOOLEAN,
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