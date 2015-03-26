/**
 * Moback User Mgr allows you to create users, have them login later, retrieve user details.
 */
moback.userMgr = function () {
  var userObjectId = false;
  var sessionToken = false;
  var data = {};
  var self = this;

  /**
   * Set a parameter value for a user
   * @param {String} key Please set this 3 required parameters(userId, email, password), and add any additional ones
   * @param {String} value The value to set the parameter to
   * @returns {string}
   */
  this.set = function(key, value){
      data[key] = value;
      return "Property is set";
  };

  /**
   * Gets the current parameter value for a user
   * @param {String} key Paramter you are fetching
   * @returns {string} returns string or false
   */
  this.get = function(key){
    if(data[key]) {
      return data[key];
    }
    return false;
  };

  /**
   * creates a moback user
   * userObj has to have some required fields(userId, email, password) before calling createUser method
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
   * Logs in a moback user with a given session token.
   * @param {String} userSessionToken saved session token of the user
   * @param {Function} callback
   */
  this.loginWithSessionToken = function (userSessionToken, callback) {
    sessionToken = userSessionToken;
    var url = baseUrl + "usermanager/api/users/user";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey,
      'X-Moback-SessionToken-Key': sessionToken
    };
    microAjax('GET', url, function (res) {
      if(res.responseObject.code && res.responseObject.code == '1000'){
        var user = res.user;
        for (var prop in user) {
          if(prop == "createdAt" || prop == "updatedAt"){
            self[prop] = user[prop];
          } else if(prop == "objectId"){
            userObjectId = user[prop];
          } else {
            data[prop] = user[prop];
          }
        }
        callback(res.user);
      } else {
        callback(res);
      }
    }, headers);

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
    userObjectId = false;
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
        if(res.responseObject.code && res.responseObject.code == '1000'){
          var user = res.user;
          for (var prop in user) {
            if(prop == "createdAt" || prop == "updatedAt"){
              self[prop] = user[prop];
            } else if(prop == "objectId"){
              userObjectId = user[prop];
            } else {
              data[prop] = user[prop];
            }
          }
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