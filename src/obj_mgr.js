moback.objMgr = function (table) {
  if(table){
    this.className = table;
  }
  var rowObjectId = false;
  var rowTable = table;
  var data = {};
  var self = this;
  var parent = null;
  var relations = [];

    /**
     * Creates an object in the table specified in the
     * constructor.
     * @param rowObj
     * @param callback
     */
  this.createObject = function (rowObj,callback) {
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
     * Creates a moback object from the object returned by moback query operation
     * @param existingObj
     * @returns {moback.objMgr}
     */
  this.createFromExistingObject = function(existingObj){
    //var existingObj = this;
    //return existingObj;
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
        if(existingObj[prop]['__type'] && existingObj[prop]['__type'] == "Pointer"){
          var parentObj = new Moback.objMgr(existingObj[prop]['className']);
          parentObj.id = existingObj[prop]['objectId'];
          parent = parentObj;
        } else if(existingObj[prop].length && existingObj[prop][0]['__type'] &&
          existingObj[prop][0]['__type'] == "Pointer"){
          //relations structure
          var relObj = new Relation(prop);
          for (var i = 0; i < existingObj[prop].length; i++) {
            var pointerObj = {};
            var pointerObj = new Moback.objMgr(existingObj[prop][i].className);
            pointerObj.id = existingObj[prop][i].objectId;
            relObj.currentObjects.push(pointerObj);
          }
          relations.push(relObj);
        } else {
          //regular key value
          self.set(prop, existingObj[prop]);
        }
      }
    }
  };

  /**
   * return the current table which this object belongs to
   * @returns {string} table name
   */
  this.getTable = function() {
    return rowTable;
  };

    /**
     * Sets the properties of the object
     * @param key
     * @param value
     */
  this.set = function(key, value) {
    var successMsg = "";
    if(key == "parent"){
      parent = value;
      successMsg = "Parent set";
    } else {
      data[key] = value;
      successMsg = "Property set";
    }
    return successMsg;
  };

    /**
     * Returns the value of the property passed to this method
     * @param key
     * @returns {*}
     */
  this.get = function(key) {
    if(key == "parent"){
      return parent;
    } else{
      if(data[key]) {
        return data[key];
      } else {
        return ("Property does not exist");
      }
    }
  };

    /**
     * Resets the key to null
     * @param key
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

    /**
     * Saves the object in the table by
     * making an API call
     *
     */
  this.save = function(callback) {
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
        //console.log(addRelationArray);
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

    /*parent, pointer implementation*/
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

    /*for each key, assign it to a value*/
    for(var key in data){
      postData[key] = data[key];
    }

    //console.log(postData);
    //return;

    saveAPI(postData, callback);
  };

  /**
   * internal function to call the save api
   * @param postData - data to post
   * @param callback
   */
  function saveAPI(postData, callback){
    console.log(callback);
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };

    if(!rowObjectId) {
      var url = baseUrl + "objectmgr/api/collections/" + table;
      microAjax('POST', url, function (res) {
        if(res.objectId){
          rowObjectId = res.objectId;
          self.id = res.objectId;
          self.createdAt = res.createdAt;
          self.updatedAt = res.updatedAt;
        }
        callback(res);
      }, headers, postData);
    } else if (rowObjectId && rowTable){
      var url = baseUrl + "objectmgr/api/collections/" + rowTable + "/" + rowObjectId;
      microAjax('PUT', url, function (res) {
        callback(res);
      }, headers, postData);
    }
  }

  /**
   * internal function to remove pointers from table
   * @param pointers
   * @param callback
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
   * @param callback
   */
  this.fetch = function(callback) {
      var url = baseUrl + "objectmgr/api/collections/" + rowTable + "/" + self.id;
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
     * Removes the object from the table
     */
  this.remove = function() {
      if(rowObjectId){
          var url = baseUrl + "objectmgr/api/collections/" + rowTable + "/" + rowObjectId;
          var headers = {
              'X-Moback-Environment-Key': envKey,
              'X-Moback-Application-Key': appKey
          };
          microAjax('DELETE', url, function (res) {
              console.log(res);
          }, headers);
      } else {
          console.log("Object does not exist");
      }
  };


  /**
   * Resets the key to null
   * @param key
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
   * Updates the object with new data passed as an object this method
   * @param rowObj
   * @param callback
   */
  this.updateObject = function (rowObj, callback) {
    if (rowObjectId && rowTable){
      var url = baseUrl + rowTable + "/" + rowObjectId;
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('PUT', url, function (res) {
        callback(res);
      }, headers, rowObj);
    } else {
      callback("Row object id is not set, please select an object first");
    }
  };


  //see if relations with key name exists
  function getRelationObj(name){
    for (var i = 0; i < relations.length; i++) {
      if (relations[i].name == name){
        return relations[i];
      }
    }
    var relObj = new Relation(name);
    relations.push(relObj);
    return relations[relations.length - 1];
    //return relObj;
  }

  function Relation(name){
    var relation = {};
    relation.name = name;
    relation.currentObjects = [];
    relation.addQueue = [];
    relation.removeQueue = [];
    return relation;
  }



};
