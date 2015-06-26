
  //'use strict';
  var moback = {};
  var appKey = '';
  var envKey = '';
  //var baseUrl = 'http://moback-stage-481937747.us-west-2.elb.amazonaws.com:8080/';
  var baseUrl = 'https://api.moback.com/';
  var sessionToken = null;

  moback.initialize = function (newAppKey, newEnvKey) {
    appKey = newAppKey;
    envKey = newEnvKey;
  };

  moback.showAppKey = function () {
    return {appKey: appKey, envKey: envKey};
  };

  moback.setAPILocation = function (newLocation) {
    baseUrl = newLocation;
  };

  moback.showAPILocation = function () {
    return {url: baseUrl};
  };

  moback.saveSession = function () {
    if(typeof(Storage) !== "undefined") {
      localStorage.setItem("mobackSession", sessionToken);
    } else {
      // Sorry! No Web Storage support..
    }
  };

  moback.getSession = function () {
    if(typeof(Storage) !== "undefined") {
      return localStorage.mobackSession;
    } else {
      // Sorry! No Web Storage support..
      return sessionToken;
    }
  };

  moback.clearSession = function () {
    if(typeof(Storage) !== "undefined") {
      localStorage.removeItem("mobackSession");
    }
    sessionToken = null;
  };


