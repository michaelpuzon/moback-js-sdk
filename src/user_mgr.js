moback.userMgr = function () {
  var userObjectId = false;
  var sessionToken = false;

  this.createUser = function (userObj, callback) {
      var url = "http://moback-stage-481937747.us-west-2.elb.amazonaws.com:8080/objectmgr/api/collections/__appUsers";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    microAjax('POST', url, function (res) {
      if(res.objectId){
        userObjectId = res.objectId;
      }
      callback(res);
    }, headers, userObj);
  };


  this.login = function (username, password, callback) {
    var url = 'http://moback-stage-481937747.us-west-2.elb.amazonaws.com:8080/usermanager/api/users/login';
    var postData = {"userId": username, "password": password};
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    microAjax('POST', url, function (res) {
      if(res.response.objectId){
        userObjectId = res.response.objectId;
      }
      callback(res);
    }, headers, postData);

  };

  this.getUserDetails = function (callback) {
    if (userObjectId){
      var url = "http://moback-stage-481937747.us-west-2.elb.amazonaws.com:8080/objectmgr/api/collections/__appUsers/" + userObjectId;
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
        callback(res);
      }, headers);
    } else {
      callback("User object id is not set, please login or create user first");
    }
  };

  this.resetPassword = function (emailId, callback) {
    var url = "http://moback-stage-481937747.us-west-2.elb.amazonaws.com:8080/usermanager/api/users/password/reset";
    var postdata = {"userId": emailId};
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };

    microAjax('POST', url, function (res) {
      callback(res);
    }, headers, postdata);
  };

  this.updateUser = function (updateObject, callback) {
    if (userObjectId){
      var url = "http://moback-stage-481937747.us-west-2.elb.amazonaws.com:8080/objectmgr/api/collections/__appUsers/" + userObjectId;
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('PUT', url, function (res) {
        callback(res);
      }, headers, updateObject);
    } else {
      callback("User object id is not set, please login or create user first");
    }
  };

  this.showAppKey = function () {
    return {appKey: appKey, envKey: envKey};
  };

  this.sendInvite = function (inviteeId, sessionTokenKey, callback) {
    var url = "http://moback-stage-481937747.us-west-2.elb.amazonaws.com:8080/usermanager/api/users/invitation";
    var postdata = {"inviteeID": inviteeId};
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey,
      'X-Moback-SessionToken-Key': sessionTokenKey
    };
    microAjax('POST', url, function (res) {
      callback(res);
    }, headers, postdata);
  };

};