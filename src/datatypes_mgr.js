/**
 * Provide support for other different complex data types supported by Moback.
 */

moback.Date = function (dateObj) {
  var newDate = new Date(dateObj).toISOString();
  this.dateObj = { "__type" : "Date" , "iso" : newDate};
};

moback.Date.prototype.getValue = function() {
  return this.dateObj;
};

moback.Date.prototype.setDate = function(dateObj) {
  var newDate = new Date(dateObj).toISOString();
  this.dateObj = { "__type" : "Date" , "iso" : newDate};
};

moback.GeoPoint = function (lat, lon) {
  this.geoObj = { "__type" : "GeoPoint" , "lat":lat, "lon":lon};
};

moback.GeoPoint.prototype.getValue = function() {
  return this.geoObj;
};

moback.GeoPoint.prototype.setGeoPoint = function(lat, lon) {
  this.geoObj = { "__type" : "GeoPoint" , "lat":lat, "lon":lon};
};