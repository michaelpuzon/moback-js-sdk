/**
 * Provide support for other different complex data types supported by Moback.
 */

/**
 * Moback Date object instantation
 * @param {Date} dateObj Accepts a date object
 * @constructor
 */
moback.Date = function (dateObj) {
  var newDate = new Date(dateObj).toISOString();
  this.dateObj = { "__type" : "Date" , "iso" : newDate};
};

/**
 * Returns the current moback date object. This is used for moback object parameters
 * @returns {{__type: string, iso: string}|*|moback.Date.dateObj}
 */
moback.Date.prototype.getValue = function() {
  return this.dateObj;
};

/**
 * Update the moback date with the new date
 * @param {Date} dateObj replace the current date with a new date
 */
moback.Date.prototype.setDate = function(dateObj) {
  var newDate = new Date(dateObj).toISOString();
  this.dateObj = { "__type" : "Date" , "iso" : newDate};
};

/**
 * Moback Geopoint object instantation
 * @param {Number} lat The latitude of the geopoint.
 * @param {Number} lon The longitude of the geopoint.
 * @constructor
 */
moback.GeoPoint = function (lat, lon) {
  this.geoObj = { "__type" : "GeoPoint" , "lat":lat, "lon":lon};
};

/**
 * Returns the current moback geopoint object. This is used for moback object parameters
 * @returns {{__type: string, lat: Number, lon: Number}|*|moback.GeoPoint.geoObj}
 */
moback.GeoPoint.prototype.getValue = function() {
  return this.geoObj;
};

/**
 * Update the coordinates for an existing geopoint
 * @param {Number} lat The latitude of the geopoint.
 * @param {Number} lon The longitude of the geopoint.
 */
moback.GeoPoint.prototype.setGeoPoint = function(lat, lon) {
  this.geoObj = { "__type" : "GeoPoint" , "lat":lat, "lon":lon};
};