'use strict';
module.exports = (sequelize, DataTypes) => {
  const place = sequelize.define('place', {
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    lat: DataTypes.REAL,
    long: DataTypes.REAL
  }, {});
  place.associate = function(models) {
    // associations can be defined here
  };
  return place;
};