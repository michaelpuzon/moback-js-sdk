/**
 * Moback User Mgr allows you to create users, have them login later, retrieve user details.
 */
moback.userMgr = function () {
  var userObjectId = false;
  var sessionToken = false;
  var data = {};

  this.set = function(key, value){
      data[key] = value;
      return "Property is set";
  };

  this.get = function(key){
    if(data[key]) {
      return data[key];
    }
    return false;
  };

  /**
   * creates a moback user
   * @param {Object} userObj has to have some required fields(userId, email, password)
   * e.g. {"userId":"user1", "password":"xxxx", "email":"xxx@xxx.com", "firstname":"Uday", "lastname":"nayak" }
   * @param {Function} callback Will output either success or failed message.
   */
  this.createUser = function (callback) {
    var url = baseUrl + "usermanager/api/users/signup";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    microAjax('POST', url, function (res) {
      if(res.objectId){
        userObjectId = res.objectId;
      }
      callback(res);
    }, headers, data);
  };

  /**
   * Login a moback user.
   * @param {String} username UserId of user required
   * @param {String} password Password of user required
   * @param {Function} callback
   */
  this.login = function (username, password, callback) {
    var url = baseUrl + "usermanager/api/users/login";
    var postData = {"userId": username, "password": password};
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    microAjax('POST', url, function (res) {
      if(res.response.objectId && res.ssotoken){
        userObjectId = res.response.objectId;
        sessionToken = res.ssotoken;
      }
      callback(res);
    }, headers, postData);
  };

  /**
   * Returns the session token if the user is logged in else returns false
   * @returns {String} sessionToken or false
   */
  this.getSessionToken = function(){
      if(sessionToken) {
          return sessionToken;
      }
      return false;
  };

  /**
   * Logs out the user.
   * @returns {string}
   */
  this.logout = function(){
     sessionToken = false;
     data = {};
     return "User has been successfully logged out."
  };

  /**
   * Returns all information about a user
   * @param {Function} callback
   */
  this.getUserDetails = function (callback) {
   if(sessionToken){
      var url = baseUrl + "usermanager/api/users/user";
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey,
        'X-Moback-SessionToken-Key': sessionToken
      };
      microAjax('GET', url, function (res) {
        if(res.code && res.code == '1000'){
          callback(res.user);
        } else {
          callback(res);
        }
      }, headers);
   } else {
      callback("User session token is not set, please login or create user first");
    }
   };

  /**
   * Sends the user a reset password email, for them to reset their passwords
   * @param {String} emailId email address of the user required field
   * @param {Function} callback
   */
  this.resetPassword = function (emailId, callback) {
    var url = baseUrl + "usermanager/api/users/password/reset";
    var postdata = {"userId": emailId};
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };

    microAjax('POST', url, function (res) {
      callback(res);
    }, headers, postdata);
  };

  /**
   * Update user information. Expects an update Objects, which will be similar to object used for registration.
   * @param {Function} callback
   */
  this.updateUser = function (callback) {
    if (sessionToken){
      var url = baseUrl + "usermanager/api/users/user";
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey,
        'X-Moback-SessionToken-Key': sessionToken
      };
      microAjax('PUT', url, function (res) {
        callback(res);
      }, headers, data);
    } else {
      callback("User session token is not set, please login the user first");
    }
  };


  /**
   * Removes the object from the table, cloud
   * @param {Function} callback
   * @returns {string} success confirmation that the user has been delete
   */
  this.deleteUser = function(callback) {
    if(sessionToken){
      var url = baseUrl + "usermanager/api/users/user";
      var headers = {
          'X-Moback-Environment-Key': envKey,
          'X-Moback-Application-Key': appKey,
          'X-Moback-SessionToken-Key': sessionToken
      };
      microAjax('DELETE', url, function (res) {
          callback(res);
      }, headers);
    } else {
        callback("Objects does not exist");
    }
  };

  /**
   * Sends the user an invitation email, to use the app.
   * @param {String} inviteeId Email address of user invited
   * @param {Function} callback
   */
  this.sendInvite = function (inviteeId, callback) {
    if (userObjectId){
      var url = baseUrl + "usermanager/api/users/invitation";
      var postdata = {"inviteeID": inviteeId};
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey,
        'X-Moback-SessionToken-Key': sessionToken
      };
      microAjax('POST', url, function (res) {
        callback(res);
      }, headers, postdata);
    } else {
      callback("User object id is not set, please login the user first");
    }
  };

};