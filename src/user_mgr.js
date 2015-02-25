/**
 * Moback User Mgr allows you to create users, have them login later, retrieve user details.
 */
moback.userMgr = function () {
  var userObjectId = false;
  var sessionToken = false;

  /**
   * creates a moback user
   * @param userObj has to have some required fields(userId, email, password)
   * e.g. {"userId":"user1", "password":"xxxx", "email":"xxx@xxx.com", "firstname":"Uday", "lastname":"nayak" }
   * @param callback to run, with success message being returned.
   */
  this.createUser = function (userObj, callback) {
    var url = baseUrl + "objectmgr/api/collections/__appUsers";
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

  /**
   * Login a moback user.
   * @param username - required
   * @param password - required
   * @param callback
   */
  this.login = function (username, password, callback) {
    var url = baseUrl + "usermanager/api/users/login";
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


  /**
   * Logs out the user.
   * @returns {string}
   */
  this.logout = function(){
    userObjectId = false;
    return "User has been successfully logged out."
  };

  /**
   * Returns all information about a user
   * @param callback
   */
  this.getUserDetails = function (callback) {
    if (userObjectId){
      var url = baseUrl + "objectmgr/api/collections/__appUsers/" + userObjectId;
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

  /**
   * Sends the user a reset password email, for them to reset their passwords
   * @param emailId - required field
   * @param callback
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
   * Update user information. Expects an update Object, which will be similar to object used for registration.
   * @param updateObject
   * @param callback
   */
  this.updateUser = function (updateObject, callback) {
    if (userObjectId){
      var url = baseUrl + "objectmgr/api/collections/__appUsers/" + userObjectId;
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

  /**
   * Sends the user an invitation email, to use the app.
   * @param inviteeId
   * @param sessionTokenKey
   * @param callback
   */
  this.sendInvite = function (inviteeId, sessionTokenKey, callback) {
    var url = baseUrl + "usermanager/api/users/invitation";
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