
  //'use strict';
  var moback = {};
  var appKey = '';
  var envKey = '';
  //var baseUrl = 'http://moback-stage-481937747.us-west-2.elb.amazonaws.com:8080/';
  var baseUrl = 'https://api.moback.com/';

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


