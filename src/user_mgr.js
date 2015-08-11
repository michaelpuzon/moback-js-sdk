/**
 * Moback User Mgr allows you to create users, have them login later, retrieve user details.
 */
moback.userMgr = function () {
  moback.objMgr.call(this, "__appUsers"); //inherit the moback obj mgr

  var self = this;

  /**
   * creates a moback user
   * @param {Function} callback Will output either success or failed message.
   */
  this.createUser = function (callback) {
    if(self.get("userId") == "Property does not exist" || self.get("email") == "Property does not exist" ||
      self.get("password") == "Property does not exist"){
      callback("userId, email, and password not set");
      return;
    }
    if(self.id){
      callback("User already created");
    } else {
      self.save(callback);
    }
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
        self.id = res.response.objectId;
        sessionToken = res.ssotoken;
        moback.saveSession();
        self.loginWithSessionToken(sessionToken, callback);
      } else {
        callback(res);
      }
    }, headers, postData);
  };

  /**
   * Logs in a moback user with a given session token.
   * @param {String} userSessionToken saved session token of the user
   * @param {Function} callback
   */
  this.loginWithSessionToken = function (userSessionToken, callback) {
    sessionToken = userSessionToken;
    moback.saveSession();
    var url = baseUrl + "usermanager/api/users/user";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
      //'X-Moback-SessionToken-Key': sessionToken
    };
    microAjax('GET', url, function (res) {
      if(res.responseObject.code && res.responseObject.code == '1000'){
        var user = res.user;
        self.id = user.objectId;
        //self.fetch(callback);
        self.createFromExistingObject(res.user);
        callback(res.user);
      } else {
        callback(res);
      }
    }, headers);

  };

  /**
   * Returns the session token if the user is logged in else returns null
   * @returns {String} sessionToken or false
   */
  this.getSessionToken = function(){
    return moback.getSession();
  };

  /**
   * Logs out the user.
   * @returns {string}
   */
  this.logout = function(){
    sessionToken = null;
    moback.clearSession();
    delete self.id;
    self.unsetAll();
    return "User has been successfully logged out."
  };

  /**
   * Returns all information about a user
   * @param {Function} callback
   */
  /*
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
   */

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
  /*
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
  */


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
          'X-Moback-Application-Key': appKey
      };
      microAjax('DELETE', url, function (res) {
        self.logout();
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
        'X-Moback-Application-Key': appKey
        //'X-Moback-SessionToken-Key': sessionToken
      };
      microAjax('POST', url, function (res) {
        callback(res);
      }, headers, postdata);
    } else {
      callback("User object id is not set, please login the user first");
    }
  };

};