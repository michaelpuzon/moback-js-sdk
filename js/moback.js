(function (window) {

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



/**
 * Moback User Mgr allows you to create users, have them login later, retrieve user details.
 * @constructor
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
        moback.saveUser(res.user);
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
   * Returns the session token if the user is logged in else returns null
   * @returns {String} sessionToken or false
   */
  this.autoLogin = function(){
    var user = moback.getUser();
    self.createFromExistingObject(user);
    return user;
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
/**
 * Object manager represents one row in a table.
 * With that one row of data, you can do set function, for setting a paramter, save to save changes.
 * Object manager also supports parents for one to one pointers, and relations for one to many,
 * and many to many relationships.
 * @constructor
 * @param {String} table Required parameter to know which table to do operations on.
 * @property id The object id of the object
 * @property createdAt The object's created at date
 * @property updatedAt The object's updated at date
 */
moback.objMgr = function (table) {
  if(table){
    this.className = table;
  }
  var rowObjectId = false;
  var rowTable = table;
  var data = {};
  var acl = null;
  var self = this;
  var parent = null;
  var relations = [];
  var includes = [];

    /**
     * Deprecated Creates an object in the table specified in the
     * constructor.
     * @param {Object} rowObj
     * @param {Function} callback
     */
  this.createObject = function (rowObj, callback) {
    var url = baseUrl + "objectmgr/api/collections/" + table;
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    microAjax('POST', url, function (res) {
      if(res.objectId){
        rowObjectId = res.objectId;
        createdAt = res.createdAt;
        updatedAt = res.updatedAt;
        rowTable = table;
      }
      callback(res);
    }, headers, rowObj);
  };

    /**
     * Creates a moback object from the object returned by moback query operations
     * @param {Object} existingObj
     * @returns {moback.objMgr} Returns a moback object
     */
  this.createFromExistingObject = function(existingObj){
    //var existingObj = this;
    //return existingObj;
    relations = [];
    for(var prop in existingObj){
      //if default property assign it directly, else use set
      if(prop == 'createdAt' || prop == 'updatedAt' || prop == 'objectId'){
        if(prop == 'objectId'){
          self.id = existingObj[prop];
          rowObjectId = existingObj[prop];
        } else {
          self[prop] = existingObj[prop];
        }
      } else {
        //check if pointer structure
        if(existingObj[prop] && existingObj[prop]['__type'] && existingObj[prop]['__type'] == "Pointer") {
          var newObj = new moback.objMgr(existingObj[prop]['className']);
          newObj.createFromExistingObject(existingObj[prop]);
          self.set(prop, newObj);
        } else if(existingObj[prop] && existingObj[prop]['__type'] && existingObj[prop]['__type'] == "Relation"){
          //relations structure
          var relObj = new Relation(prop);
          for (var i = 0; i < existingObj[prop].value.length; i++) {
            var pointerObj = new moback.objMgr(existingObj[prop].value[i].className);
            pointerObj.createFromExistingObject(existingObj[prop].value[i]);
            relObj.currentObjects.push(pointerObj);
          }
          relations.push(relObj);
        } else if(existingObj[prop] && prop == "__acl"){
          //relations structure
          acl = new moback.aclMgr(existingObj[prop]);
        } else {
          //regular key value
          self.set(prop, existingObj[prop]);
        }
      }
    }
  };

  /**
   * Sets the properties of the object
   * @param {String} key
   * @param {Object} value Value can be string, object, number, boolean
   */
  this.set = function(key, value) {
    var successMsg = "";
    if(key == "parent"){
      parent = value;
      successMsg = "Parent set";
    } else if(value && typeof value.getValue != "undefined" && value.getValue() != false){
      var customObj = value.getValue();
      data[key] = customObj;
      successMsg = "Property set";
    } else {
      data[key] = value;
      successMsg = "Property set";
    }
    return successMsg;
  };

  /**
   * Sets the acl permissions of the object
   * @param {Object} aclObj Pass an instance of Moback.aclMgr
   */
  this.setACL = function(aclObj) {
    var successMsg = "";
    if(aclObj){
      acl = aclObj;
      successMsg = "ACL for object set";
    } else {
      successMsg = "ACL object missing";
    }
    return successMsg;
  };

  /**
   * Returns the acl permissions of the object
   */
  this.getACL = function() {
    if(acl){
      return acl;
    }
    return null;
  };


  /**
   * Returns the value of the property passed to this method
   * @param {String} key Key used to the parameter of object
   * @returns {*}
   */
  this.get = function(key) {
    if(key == "parent"){
      return parent;
    } else {
      if(data[key]) {
        /*
        if(data[key].__type && data[key].__type == 'GeoPoint'){
          return new Mo
        } else {
        */
          return data[key];
        //}
      }
    }
    return (null);
  };

  /**
   * Returns all properties of the current object
   * @returns {*}
   */
  this.getAll = function() {
    return data;
  };

    /**
     * Resets the key to null, and deletes the parameter
     * @param {String} key
     */
  this.unset = function(key) {
    if(key == "parent"){
      parent = null;
    } else {
      data[key] = null;
      delete data[key];
    }
    return 'item ' + key + ' unset';
  };

  this.unsetAll = function() {
    data = {};
    return 'all items unset';
  };

  /**
   * Saves the object in the table by
   * making an API call
   * @param {Function} callback
   */
  this.save = function(callback) {
    //prepare object to pass to api call
    var postData = self.getSaveInfo();

    saveAPI(postData, callback);
  };

  /**
   * Return save information, to be used for moback batch processing, and for single object saving
   */
  this.getSaveInfo = function() {
    //prepare object to pass to api call
    var postData = {};

    /*relation implementation*/
    if(relations.length > 0){

      var addRelationArray = [], removeRelationArray = [];

      for (var i = 0; i < relations.length; i++) {

        var name = relations[i].name;
        var addQueue = [], removeQueue = [];

        for (var j = 0; j < relations[i].removeQueue.length; j++) {
          var newRelation = {"__type":"Pointer"};
          newRelation.objectId = relations[i].removeQueue[j].id;
          newRelation.className = relations[i].removeQueue[j].className;
          removeQueue.push(newRelation);
        }
        if(removeQueue.length > 0 ){
          relations[i].removeQueue = [];
          var relationRemoveItem = {};
          relationRemoveItem.objects = removeQueue;
          relationRemoveItem['__op'] = "RemoveRelation";
          relationRemoveItem.name = name;
          removeRelationArray.push(relationRemoveItem);
        }
        for (var j = 0; j < relations[i].addQueue.length; j++) {
          var newRelation = {"__type":"Pointer"};
          newRelation.objectId = relations[i].addQueue[j].id;
          newRelation.className = relations[i].addQueue[j].className;
          addQueue.push(newRelation);
        }

        if(addQueue.length > 0 ){
          var relationAddItem = {};
          relationAddItem.objects = addQueue;
          relationAddItem['__op'] = "AddRelation";
          relationAddItem.name = name;
          addRelationArray.push(relationAddItem);
        }
      }
      if(removeRelationArray.length > 0){
        removePointers(removeRelationArray, callback);
        return;
      }
      if(addRelationArray.length > 0){
        //form objects for api call
        for (var i = 0; i < addRelationArray.length; i++) {
          var name = addRelationArray[i].name;
          delete addRelationArray[i].name;
          postData[name] = addRelationArray[i];
        }
        /*move all addQueue objects to currentObjects*/
        for (var i = 0; i < relations.length; i++) {
          if(relations[i].addQueue.length > 0){
            var addQueueArr = relations[i].addQueue.splice(0, relations[i].addQueue.length);
            relations[i].currentObjects = relations[i].currentObjects.concat(addQueueArr);
          }
        }
      }
    }

    //deprecated code for pointers
    /*
    if(parent != null){
      if(parent.id){
        postData.parent = {
          "__type":"Pointer",
          "objectId": parent.id,
          "className": parent.className
        };
      } else {
        //create the parent object dynamically and then do the save on the current obj
        parent.save(function(){
          self.save(callback);
        });
        return;
      }
    }
    */

    /*for each key, assign it to a value*/
    for(var key in data){
      if(data[key] && data[key] !== null){
        //this is a pointer to another table, save it like below
        if(data[key].id){
          postData[key] = {
            "__type": "Pointer",
            "objectId": data[key].id,
            "className": data[key].className
          };
        } else if(data[key].objectId) {
          postData[key] = {
            "__type": "Pointer",
            "objectId": data[key].objectId,
            "className": data[key].className
          };
        } else {
          postData[key] = data[key];
        }
      }
    }
    if(acl){
      postData['__acl'] = acl.getACL();
    }
    return postData
  };

  /**
   * internal function to call the save api
   * @param {Object} postData - data to post
   * @param {Function} callback
   */
  function saveAPI(postData, callback){
    //console.log(postData);
    //console.log(callback);
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };

    if(!self.id) {
      var url;
      if(typeof self.createUser === "function"){
        url = baseUrl + "usermanager/api/users/signup";
      } else {
        url = baseUrl + "objectmgr/api/collections/" + table;
      }
      microAjax('POST', url, function (res) {
        if(res.objectId){
          rowObjectId = res.objectId;
          self.id = res.objectId;
          self.createdAt = res.createdAt;
          self.updatedAt = res.updatedAt;
        }
        callback(res);
      }, headers, postData);
    } else if (rowTable){
      var url;
      if(typeof self.createUser === "function"){
        url = baseUrl + "usermanager/api/users/user";
      } else {
        url = baseUrl + "objectmgr/api/collections/" + rowTable + "/" + self.id;
      }
      microAjax('PUT', url, function (res) {
        callback(res);
      }, headers, postData);
    }
  }

  /**
   * internal function to remove pointers from table
   * @param {Array} pointers
   * @param {Function} callback
   */
  function removePointers(pointers, callback){
    var postData = {};
    for (var i = 0; i < pointers.length; i++) {
      var name = pointers[i].name;
      delete(pointers[i].name);
      postData[name] = pointers[i];
    }

    saveAPI(postData, function(){
      self.save(callback);
    });
  }


  /**
   * Retrieve the existing object from the cloud.
   * @param {Function} callback
   */
  this.fetch = function(callback) {
      var url = baseUrl + "objectmgr/api/collections/" + rowTable + "/" + self.id;
      if(includes.length > 0){
        var includeStr = "";
        for (var i = 0; i < includes.length; i++) {
          includeStr += includes[i] + ",";
        }
        url = url + "?include=" + includeStr;
      }
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
        self.createFromExistingObject(res);
        callback(res);
      }, headers);
  };

  /**
   * On query of an object, return the results of whole object in pointer columns
   * @param {String} key Key column of the table
   * @returns {string}
   */
  this.include = function (key){
    if (key){
      includes.push(key);
      return ("Add include for " + key);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * Removes the object from the table, cloud
   * @param {Function} callback
   * @returns {string} output message
   */
  this.remove = function(callback) {
    if(rowObjectId){
        var url = baseUrl + "objectmgr/api/collections/" + rowTable + "/" + self.id;
        var headers = {
            'X-Moback-Environment-Key': envKey,
            'X-Moback-Application-Key': appKey
        };
        microAjax('DELETE', url, function (res) {
          callback(res);
          delete self.id;
          self.unsetAll();
        }, headers);
    } else {
      callback("Objects does not exist");
    }
  };


  /**
   * The relation object. This supports add, remove methods for relations.
   * You can also call the getSaved, to view saved relations for the object.
   * An inspect method is also available for viewing all relations in the current object.
   * @param {String} name Will be used as the key for the relations array.
   */
  this.relation = function(name) {
    self.unset(name);
    var relateMethods = {};
    var relationObj = getRelationObj(name);

    relateMethods.add = function(obj){
      relationObj.addQueue.push(obj);
      return 'item relation added';
    };

    relateMethods.remove =  function(obj){
      //if item is in the add queue, remove it there
      var objFound = false;
      //look for the item in the add queue
      for (var i = 0; i < relationObj.addQueue.length; i++) {
        if(relationObj.addQueue[i].id){
          relationObj.addQueue.splice(i, 1);
          objFound = true;
          return 'item relation removed';
        }
      }
      //look for the item in the remove queue
      for (var i = 0; i < relationObj.currentObjects.length; i++) {
        if(relationObj.currentObjects[i].id){
          relationObj.currentObjects.splice(i, 1);
          objFound = true;
          relationObj.removeQueue.push(obj);
          return 'item relation removed';
        }
      }
      return 'item could not be found';
    };

    relateMethods.getSaved = function(){
      return relationObj.currentObjects;
    };

    relateMethods.inspect = function(){
      return relations;
    };

    return relateMethods;
  };


  /**
   * Internal methoed to see if relations with key name currently exists
   * @param {String} name
   * @returns {*}
   */
  function getRelationObj(name){
    for (var i = 0; i < relations.length; i++) {
      if (relations[i].name == name){
        return relations[i];
      }
    }
    var relObj = new Relation(name);
    relations.push(relObj);
    return relations[relations.length - 1];
  }

  /**
   * Constructor object for laying out structure for a relation object
   * @param {String} name
   * @returns {{}} Relation object
   * @constructor
   */
  function Relation(name){
    var relation = {};
    relation.name = name;
    relation.currentObjects = [];
    relation.addQueue = [];
    relation.removeQueue = [];
    return relation;
  }

};

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
/**
 * ACL manager allows you to set permissions to a moback object.
 * @param {Object} fileName Filename to be used for the file
 * @param {File} fileData The actual file data
 * @constructor
 */
moback.aclMgr = function (existingACL) {

  var acl = {};

  if(existingACL){
    acl = existingACL;
    /*
    delete acl.createdBy;
    for (var i = 0; i < acl.userWrite.length; i++) {
      delete acl.userWrite[i].ruleType;
      delete acl.userWrite[i].userId;
    }
    */
  } else {
    acl = {
      "globalRead": true,
      "globalWrite": true,
      "userRead": [],
      "userWrite": [],
      "groupRead": [],
      "groupWrite": []
    };
  }

  /**
   * Sets the acl's public write permission
   * @param {Boolean} flag boolean flag to set this variable true or false
   */
  this.setPublicWritePermission = function(flag){
    acl.globalWrite = flag;
    return "Public Permission set";
  };

  /**
   * Sets the acl's public read permission
   * @param {Boolean} flag boolean flag to set this variable true or false
   */
  this.setPublicReadPermission = function(flag){
    acl.globalRead = flag;
    return "Public Permission set";
  };

  /**
   * Add or remove a role to the role write permission list
   * @param {String} role role name to add
   * @param {Boolean} flag boolean flag to set this role to write, or remove role
   */
  this.setRoleWritePermission = function(role, flag){
    for (var i = 0; i < acl.groupWrite.length; i++) {
      if (acl.groupWrite[i].roleName == role){
        if(flag){
          return 'Role already in the permission list';
        } else {
          acl.groupWrite.splice(i, 1);
          return 'Role write permission removed';
        }
      }
    }
    if(flag){
      acl.groupWrite.push({roleName: role});
      return 'Role permission added';
    } else {
      return 'Could not find role permission to remove';
    }
  };

  /**
   * Add or remove a role to the role read permission list
   * @param {String} role role name to add
   * @param {Boolean} flag boolean flag to set this role to write, or remove role
   */
  this.setRoleReadPermission = function(role, flag){
    for (var i = 0; i < acl.groupRead.length; i++) {
      if (acl.groupRead[i].roleName == role){
        if(flag){
          return 'Role already in the permission list';
        } else {
          acl.groupRead.splice(i, 1);
          return 'Role read permission removed';
        }
      }
    }
    if(flag){
      acl.groupRead.push({roleName: role});
      return 'Role permission added';
    } else {
      return 'Could not find role permission to remove';
    }
  };

  /**
   * Add or remove a role to the role write permission list
   * @param {String} user user id to add
   * @param {Boolean} flag boolean flag to set this user to write, or remove user
   */
  this.setUserWritePermission = function(user, flag){
    for (var i = 0; i < acl.userWrite.length; i++) {
      if (acl.userWrite[i].userObjectId == user){
        if(flag){
          return 'User already in the permission list';
        } else {
          acl.userWrite.splice(i, 1);
          return 'User write permission removed';
        }
      }
    }
    if(flag){
      acl.userWrite.push({userObjectId: user});
      return 'User permission added';
    } else {
      return 'Could not find User permission to remove';
    }
  };

  /**
   * Add or remove a user to the user read permission list
   * @param {String} user user id to add
   * @param {Boolean} flag boolean flag to set this user to write, or remove user
   */
  this.setUserReadPermission = function(user, flag){
    for (var i = 0; i < acl.userRead.length; i++) {
      if (acl.userRead[i].userObjectId == user){
        if(flag){
          return 'User already in the permission list';
        } else {
          acl.userRead.splice(i, 1);
          return 'User read permission removed';
        }
      }
    }
    if(flag){
      acl.userRead.push({userObjectId: user});
      return 'User permission added';
    } else {
      return 'Could not find User permission to remove';
    }
  };

  this.getACL = function(){
    return acl;
  };

  /**
   * Returns the whole acl object in json form
   */
  this.getInfo = function(){
    return JSON.stringify(acl);
  };


};

/**
 * Moback Role Mgr allows you to create roles to assign to users for permissions.
 * @constructor
 * @param {Sting} roleName Role name to be set for the role.
 */
moback.roleMgr = function (roleName) {
  moback.objMgr.call(this, "__roleSettings"); //inherit the moback obj mgr

  var self = this;

  if(roleName){
    self.set('roleName', roleName);
  }

  /**
   * creates a moback role
   * role name has to be set before creation
   * @param {Function} callback Will output either success or failed message.
   */
  this.createRole = function (callback) {
    if(self.get("roleName") == "Property does not exist"){
      callback("role name is not set");
      return;
    }
    if(self.id){
      callback("Role already created");
    } else {
      self.save(callback);
    }
  };

  /**
   * creates a shortcut to users relations
   * will return a users relation method
   */
  this.users = function () {
    return self.relation('assigned');
  };



};
/**
 * The Query manager object. This object allows you to run all sorts of queries in a table.
 * Pass table parameter on query object creation to use right away.
 * If table parameter is omitted, please use set table function afterwards.
 * @constructor
 * @param {String} table Table name to use for all query operations
 */
moback.queryMgr = function (table) {
  var baseUrlAPI = baseUrl + 'objectmgr/api/';
  var rowTable = table || false;
  var filters = [];
  var limit = false;
  var skip = false;
  var order = false;
  var keys = false;
  var includes = [];
  var queryMode = "and";

  /**
   * Change the table name currently being used by the query mgr object
   * @param {String} table New table name
   * @returns {string}
   */
  this.setTable = function (table) {
    rowTable = table;
    return "Query object has been changed to table " + table;
  };

  /**
   * Fetches an array of moback objects, based  on the current query parameters
   * @param {Function} callback
   */
  this.fetch = function (callback) {
    if (rowTable){
      var query = formQuery();
      var url = baseUrlAPI + "collections/" + rowTable + "?" + query;
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
        if(res.results){
          var objArray = [];
          for (var i = 0; i < res.results.length; i++) {
            var mobackObj = new moback.objMgr(rowTable);
            mobackObj.createFromExistingObject(res.results[i]);
            objArray.push(mobackObj);
          }
          callback(objArray);
        } else {
          callback(res);
        }
      }, headers);
    } else {
      callback("Query object is not set, please set a query object first");
    }
  };

  /**
   * Internal function to form the filters query
   */
  function formQuery(){
    var query = "where=";
    //if filters array is set, build the filters
    if(filters.length > 0){
      var whereQuery = '';
      if(filters.length == 1){
        whereQuery = whereQuery + encodeURIComponent(JSON.stringify(filters[0]));
      } else {
        var objQueries = {};
        objQueries["$" + queryMode] = filters;
        whereQuery = whereQuery + encodeURIComponent(JSON.stringify(objQueries));
      }
      if(whereQuery != ''){
        query = query + whereQuery;
      } else {
        query = query + encodeURIComponent('{}');
      }
    } else {
      query = query + encodeURIComponent('{}');
    }
    if(limit){
      query = query + "&limit=" + limit;
    }
    if(skip){
      query = query + "&skip=" + skip;
    }
    if(order){
      query = query + "&order=" + order;
    }
    if(keys){
      query = query + "&keys=" + keys;
    }
    if(includes.length > 0){
      var includeStr = "";
      for (var i = 0; i < includes.length; i++) {
        includeStr += includes[i] + ",";
      }
      query = query + "&include=" + includeStr;
    }
    if(query == "where=") {
      return '';
    } else {
      return query;
    }
  }

  /**
   * Fetches a single moback object in the table
   * @param {String} rowId Required object id of the object in the table
   * @param {Function} callback
   */
  this.fetchSingle = function (rowId, callback) {
    if (rowTable){
      var query = "";
      if(includes.length > 0){
        var includeStr = "";
        for (var i = 0; i < includes.length; i++) {
          includeStr += includes[i] + ",";
        }
        query = query + "?include=" + includeStr;
      }
      var url = baseUrlAPI + "collections/" + rowTable + "/" + rowId + query;
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
        var mobackObj = new moback.objMgr(rowTable);
        mobackObj.createFromExistingObject(res);
        callback(mobackObj);
      }, headers);
    } else {
      callback("Query object is not set, please set a query object first");
    }
  };

  /**
   * Returns the total number of rows in a table
   * @param {Function} callback
   */
  this.getCount = function (callback) {
    if (rowTable){
      var query = formQuery();
      var url = baseUrlAPI + "collections/" + rowTable + "?op=count";
      //console.log("Query is:" + query);
      if(query != ""){
        url += "&" + query;
      }
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
        if(res.count){
          callback(res.count);
        } else {
          callback(0);
        }
      }, headers);
    } else {
      callback("Query object is not set, please set a query object first");
    }
  };

  /**
   * Set's a filter to the query so the key should equal to the value.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.equalTo = function (key, value){
    if (key && value){
      var newFilter = {};
      newFilter[key] = value;
      filters.push(newFilter);
      return ("Added filter: eq " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should NOT equal to the value.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.notEqualTo = function (key, value){
    if (key && value){
      var newFilter = {};
      newFilter[key] = { "$ne" : value };
      filters.push(newFilter);
      return ("Added filter: neq " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should be greater than the value.
   * Please use this filter on numeric values only.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.greaterThan = function (key, value){
    if (key  && value){
      var newFilter = {};
      newFilter[key] = {'$gt' : value};
      filters.push(newFilter);
      return ("Added filter: gt " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should be less than the value.
   * Please use this filter on numeric values only.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.lessThan = function (key, value){
    if (key && value){
      var newFilter = {};
      newFilter[key] = {'$lt' : value};
      filters.push(newFilter);
      return ("Added filter: lt " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should be greater or equal to the value.
   * Please use this filter on numeric values only.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.greaterThanOrEqualTo = function (key, value){
    if (key  && value){
      var newFilter = {};
      newFilter[key] = {'$gte' : value};
      filters.push(newFilter);
      return ("Added filter: gte " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should be less or equal to the value.
   * Please use this filter on numeric values only.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.lessThanOrEqualTo = function (key, value){
    if (key && value){
      var newFilter = {};
      newFilter[key] = {'$lte' : value};
      filters.push(newFilter);
      return ("Added filter: lte " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should be regex exp applied to key.
   * Please use this filter on string only.
   * @param {String} key Key column in the table
   * @param {String} value The regex expression to apply to the filter
   * @returns {string} success message
   */
  this.applyRegex = function (key, value){
    if (key && value){
      var newFilter = {};
      newFilter[key] = {'$regex' : value};
      filters.push(newFilter);
      return ("Added filter: regex " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Exists, filters the query so the value for the table has to exist
   * @param {String} key Key column of the table
   * @returns {string} message
   */
  this.exists = function (key){
    if (key){
      var newFilter = {};
      newFilter[key] = {'$exists' : true};
      filters.push(newFilter);
      return ("Added filter: exists " + key);
    } else {
      return ("value for exists has to be set");
    }
  };

  /**
   * Does not exists, filters the query so the value for the table has to be empty or null
   * @param {String} key Key column of the table
   * @returns {string} message
   */
  this.doesNotExist = function (key){
    if (key){
      var newFilter = {};
      newFilter[key] = {'$exists' : false};
      filters.push(newFilter);
      return ("Added filter: does not exist " + key);
    } else {
      return ("value for does not exist has to be set");
    }
  };

  /**
   * Sets a filter so the results are within a geopoint location
   * @param {String} key Key column of the table
   * @param {Number} lat The latitude of the target geopoint.
   * @param {Number} lon The longitude of the target geopoint.
   * @param {Number} distance Optional distance value
   * @param {String} distanceUnits Optional distance unit (km | mi | degrees), defaults to degrees
   * @returns {string}
   */
  this.near = function (key, lat, lon, distance, distanceUnits){
    if (key && lat && lon){
      var geoPoint = {
        "__type": "GeoPoint",
        "lat": lat,
        "lon": lon
      };
      var newFilter = {};
      newFilter[key] = {'$near' : geoPoint};
      if (distance){
        var distanceLabel = '$maxDistance';
        if(distanceUnits){
          if(distanceUnits == "km"){
            distanceLabel = '$maxDistanceInKms';
          } else if(distanceUnits == "mi"){
            distanceLabel = '$maxDistanceInMiles';
          }
        }
        newFilter[key][distanceLabel] = distance;
      }
      filters.push(newFilter);
      return ("Added filter: near " + key + " : " + geoPoint);
    } else {
      return ("Key and geopoints are required");
    }
  };

  /**
   * A geopoint filter to find geopoints within a set of gepoints
   * @param {String} key Key column of the table
   * @param {Array} geoPoints Array of geopoints to find geoppoints within
   * @returns {string}
   */
  this.within = function (key, geoPoints){
    if (key && geoPoints){
      if(geoPoints.length < 2){
        return "At least two geopoints are required";
      }
      //construct the query
      var geoPointArray = [];
      for (var i = 0; i < geoPoints.length; i++) {
        geoPointArray.push(geoPoints[i].getValue());
      }
      var newFilter = {};
      newFilter[key] = {'$within' : { "$box": geoPointArray } };
      filters.push(newFilter);
      return ("Added filter: within " + key + " : " + geoPoints);
    } else {
      return ("Key and geopoints are required");
    }
  };

  /**
   * Returns all the current filters applied to the query
   * @returns {Array}
   */
  this.getFilters = function (){
    return filters;
  };

  /**
   * Resets all the current filters applied to the query
   * @returns {string} success message
   */
  this.resetFilters = function (){
    filters = [];
    return ("filters reset");
  };

  /**
   * Limits the number of rows returned by the query
   * @param {Number} value Numbers of rows to be returned
   * @returns {string}
   */
  this.limit = function (value){
    if (value){
      limit = value;
      return ("Set limit to " + value);
    } else {
      return ("Limit value required");
    }
  };

  /**
   * Implements skip on the query. To skip first 5, pass 5 to value
   * @param {Number} value expects number value. Set to 0 or false to disable
   * @returns {string}
   */
  this.skip = function (value){
    if (value){
      skip = value;
      return ("Set skip to " + value);
    } else {
      return ("Limit value required");
    }
  };

  /**
   * Sets the query mode to 'and' or 'or'
   * @param {String} value and/or
   * @returns {string}
   */
  this.queryMode = function (value){
    if (value == "and" || value == "or"){
      queryMode = value;
      return ("Set query mode to " + value);
    } else {
      return ("queryMode has to be 'and' or 'or'");
    }
  };

  /**
   * Implements the ascending order of the column on the query.
   * @param {String} key Key column of the table
   * @returns {string}
   */
  this.ascending = function (key){
    if (key){
      order = key;
      return ("Set ascending mode for " + key);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * Implements the descending order of the column on the query.
   * @param {String} key Key column of the table
   * @returns {string}
   */
  this.descending = function (key){
    if (key){
      order = "-" + key;
      return ("Set descending mode for " + key);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * On query of an object, return the results of whole object in pointer columns
   * @param {String} key Key column of the table
   * @returns {string}
   */
  this.include = function (key){
    if (key){
      includes.push(key);
      return ("Add include for " + key);
    } else {
      return ("value has to be set");
    }
  };



  /**
   * Only return the columns selected
   * @param {Arrays/String} value Array of key columns of the table or Single Column
   * @returns {string}
   */
  this.select = function (value){
    if (value){
      if(typeof value == "string"){
        keys = value;
      } else {
        var keysToPass = "";
        for (var i = 0; i < value.length; i++) {
          keysToPass = keysToPass + value[i] + ",";
        }
        keys = keysToPass;
      }
      return ("Restrict columns only to " + keys);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * Only return the rows with the values in column
   * @param {String} key Key column of the table
   * @param {Array} value Array of values to test against
   * @returns {string}
   */
  this.containedIn = function (key, value){
    if (value){
      var newFilter = {};
      newFilter[key] = {'$in' : value};
      filters.push(newFilter);
      return ("Filtered " + key + " column with " + value);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * Only return the rows with the values not contained in column
   * @param {String} key Key column of the table
   * @param {Array} value Array of values to test against
   * @returns {string}
   */
  this.notContainedIn = function (key, value){
    if (value){
      var newFilter = {};
      newFilter[key] = {'$nin' : value};
      filters.push(newFilter);
      return ("Filtered " + key + " column without " + value);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * Only return the rows with the array contained in column
   * Only do this for column with array type
   * @param {String} key Key column of the table
   * @param {Array} value Array of values to test against
   * @returns {string}
   */
  this.containsAll = function (key, array){
    if (array){
      var newFilter = {};
      newFilter[key] = {'$all' : array};
      filters.push(newFilter);
      return ("Filtered " + key + " now has to contain " + array);
    } else {
      return ("array has to be set");
    }
  };

  /**
   * Drops the table associated with the query object
   * @param {Function} callback
   */
  this.dropTable = function(callback) {
      if (rowTable){
          var url = baseUrlAPI + "schema/" + rowTable;
          var headers = {
              'X-Moback-Environment-Key': envKey,
              'X-Moback-Application-Key': appKey
          };
          microAjax('DELETE', url, function (res) {
              callback(res);
          }, headers);
      } else {
          callback("Table does not exist, please check the table name");
      }
  };


};

/**
 * Notification manager allows you to send notifications to users via the JS sdk.
 * It does not allow to receive notifications, at the moment.
 * @constructor
 */
moback.notificationMgr = function(){

  /**
   * Sends a notification to a single user
   * @param {String} receiverId given userId of receiver
   * @param {String} notificationMessage
   * @param {Function} callback
   */
  this.sendSingleUserNotification = function(receiverId, notificationMessage, callback) {
    var notificationObj = {
      receiverId: receiverId,
      data:{
        alert: notificationMessage
      }
    };

    var url = baseUrl + "notificationmanager/api/alerts/push";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    microAjax('POST', url, function (res) {
      callback(res);
    }, headers, notificationObj);
  };

  /**
   * Sends a notification to all users in the app
   * @param {String} notificationMessage
   * @param {Function} callback
   */
  this.sendAllNotification = function(notificationMessage, callback) {
    var toPost = {
      data:{
        alert: notificationMessage
      }
    };
    toPost.channels = ['__default'];
    var url = baseUrl + "notificationmanager/api/alerts/push";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    microAjax('POST', url, function (res) {
      callback(res);
    }, headers, toPost);
  };

  /**
   * Sends a custom email to a user
   * @param {object} toPost is an object that looks like the following:
   {
      "to":"email@example.com",
      "templateName":"test",
      "customProperties":{
        "key":"value"
      }
   }

   * @param {Function} callback
   */
  this.sendCustomEmail = function(toPost, callback) {

    var url = baseUrl + "notificationmanager/api/emails/email/custom";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    microAjax('POST', url, function (res) {
      callback(res);
    }, headers, toPost);
  };

};
/**
 * File manager allows a file to be saved in the cloud, and be subquently used in moback objects.
 * @param {String} fileName Filename to be used for the file
 * @param {File} fileData The actual file data
 * @constructor
 */
moback.fileMgr = function (fileData, fileName) {
  var fileUrl = false;

  /**
   * Saves the file, using the session token provided by logged in user
   * @param {Function} callback
   */
  this.save = function (sessionToken, callback) {
    var formData = new FormData();
    console.log(fileData);
    if(fileName){
      formData.append('file', fileData, fileName);
    } else {
      formData.append('file', fileData);
    }
    var url = baseUrl + "filemanager/api/files/upload";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey,
      'X-Moback-SessionToken-Key': sessionToken
    };
    microAjax('PUT', url, function (res) {
      if(res.url && res.name) {
          fileUrl = res.url;
          fileName = res.name;
      }
      callback(res);

    }, headers, formData, true);
  };

  /**
   * Returns the object to be used for moback object mgr
   * @returns {object} Name of the file
   */
  this.getValue = function(){
    if(fileUrl){
      var fileObj = { __type : "File" };
      fileObj.name = fileName;
      fileObj.url = fileUrl;
      return fileObj;
    }
    else {
      return false;
    }
  };

  /**
   * Returns the name of the file
   * @returns {String} Name of the file
   */
  this.getName = function(){
      if(fileName){
          return fileName;
      }
      else {
          return "File name not available"
      }
  };

  /**
   * Returns the URL of the file
   * @returns {String} URL of the file
   */
  this.getUrl = function() {
      if(fileUrl){
          return fileUrl;
      }
      else {
          return "File URL not available"
      }
  };

  /**
   * Deletes the file uploaded by the user
   * @param {String} sessionToken
   * @param {Function} callback
   */
  this.removeFile = function(sessionToken, callback) {
      //check file
    var url = baseUrl + "filemanager/api/files/file/" + fileName;
    var headers = {
       'X-Moback-Environment-Key': envKey,
       'X-Moback-Application-Key': appKey,
       'X-Moback-SessionToken-Key': sessionToken
    };
    microAjax('DELETE', url, function(res) {
        fileName = false;
        fileUrl = false;
        callback(res);
    }, headers);
  };

};

/**
 * Moback Batch Mgr allows you to execute batch operations on moback objects.
 * @constructor
 * @param {String} table Required parameter to know which table to do operations on.
 */
moback.batchMgr = function (table) {

  var mobackObjects = [];

  /**
   * adds a moback obj to batch process array
   * @param {Object} batchObj moback object with which to do an operation on
   */
  this.addJob = function (batchObj) {
    mobackObjects.push(batchObj);
  };

  /**
   * adds an array of moback objs to batch process array
   * @param {Object} batchObjs moback object with which to do an operation on
   */
  this.addJobs = function (batchObjs) {
    mobackObjects = mobackObjects.concat(batchObjs);
  };

  /**
   * run save/update on batch process array
   * @param {Function} callback
   */
  this.saveUpdateJobs = function (callback) {
    var url = baseUrl + "objectmgr/api/collections/batch/" + table;
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };

    var postData = parseMobackSaveObjects();

    microAjax('POST', url, function (res) {
      //clear batch when done
      mobackObjects = [];
      callback(res);
    }, headers, postData);
  };

  function parseMobackSaveObjects(){
    var mobackSaveObjs = [];
    for (var i = 0; i < mobackObjects.length; i++) {
      var saveObj = mobackObjects[i].getSaveInfo();
      mobackSaveObjs.push(saveObj);
    }
    return {objects : mobackSaveObjs};
  }

  /**
   * run remove object on batch process array
   * @param {Function} callback
   */
  this.deleteJobs = function (callback) {
    var url = baseUrl + "objectmgr/api/collections/batch/delete/" + table;
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };

    var postData = parseMobackDeleteObjects();

    microAjax('POST', url, function (res) {
      mobackObjects = [];
      callback(res);
    }, headers, postData);
  };

  function parseMobackDeleteObjects(){
    var mobackDeleteObjs = [];
    for (var i = 0; i < mobackObjects.length; i++) {
      //only batch delete objects with moback object ids
      if(mobackObjects[i].id){
        mobackDeleteObjs.push(mobackObjects[i].id);
      }
    }
    return {objectIds : mobackDeleteObjs};
  }



};
/*
 Copyright (c) 2008 Stefan Lange-Hegermann

 taken from https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started
 */
/*
 * method - GET, POST PUT, DELETE
 * url - full url
 * headers - additional headers, optional
 * postData - postBody, optional
 * */
function microAjax(method, url, callbackFunction, headers, postData, fileMode) {
  var httpRequest, postBody;
  if (window.XMLHttpRequest) { // Mozilla, Safari, ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE
    try {
      httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e) {
      try {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch (e) {}
    }
  }

  if (!httpRequest) {
    console.log('Giving up :( Cannot create an XMLHTTP instance');
    return false;
  }

  function processRequest(){
    if (httpRequest.readyState === 4) {
      var result = JSON.parse(httpRequest.responseText);
      callbackFunction(result);
    }
  }

  if(fileMode){
    postBody = postData;
  } else {
    postBody = (postData) ? JSON.stringify(postData) : "";
  }

  httpRequest.onreadystatechange = processRequest;
  httpRequest.open(method, url, true);
  if (postBody !== "") {
    httpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  } else {
    httpRequest.open(method, url, true);
  }
  //Attach User Session if present
  var userSession = moback.getSession();
  if(userSession){
    httpRequest.setRequestHeader("X-Moback-SessionToken-Key", userSession);
  }
  if(!fileMode){
    httpRequest.setRequestHeader("Content-Type", "application/json");
  }
  /*add any additional headers here*/
  if(headers){
    for(var key in headers){
      httpRequest.setRequestHeader(key, headers[key]);
    }
  }
  httpRequest.send(postBody);
}
if(typeof(Moback) === 'undefined') {
  window.Moback = moback;
  //window.Moback = setupMoback();
}
}(window));