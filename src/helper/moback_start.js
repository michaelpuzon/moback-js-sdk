
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

  moback.saveUser = function (userData) {
    if(typeof(Storage) !== "undefined") {
      var userInfo = JSON.stringify(userData);
      localStorage.setItem("mobackUserInfo", userInfo);
    }
  };

  moback.getUser = function () {
    if(typeof(Storage) !== "undefined" && localStorage.mobackUserInfo) {
      return JSON.parse(localStorage.mobackUserInfo);
    }
    return null;
  };

  moback.getSession = function () {
    var session;
    if(typeof(Storage) !== "undefined") {
      session = localStorage.mobackSession;
    } else {
      // Sorry! No Web Storage support..
      session = sessionToken;
    }
    if(session && session != 'undefined'){
      return session;
    } else {
      return false;
    }
  };

  moback.clearSession = function () {
    if(typeof(Storage) !== "undefined") {
      localStorage.removeItem("mobackSession");
      localStorage.removeItem("mobackUserInfo");
    }
    sessionToken = null;
  };


