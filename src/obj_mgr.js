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
   * Removes the file column from the object
   * @param {String} key Key column of the table
   * @param {Function} callback
   * @returns {string} output message
   */
  this.removeFile = function(key, callback) {
    //get the file object
    var deleteFile = data[key];
    var newFileObject = new moback.fileMgr(deleteFile.url, deleteFile.name);
    var session = moback.getSession();
    newFileObject.removeFile(session, function(res){
      data[key].name = "";
      data[key].url = "";
      callback(res);
    });
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
      if(data[key] != null){
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
