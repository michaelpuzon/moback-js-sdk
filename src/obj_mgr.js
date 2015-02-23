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
        } else {
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
    if(data[key]) {
      if(key == "parent"){
        return parent;
      } else {
        return data[key];
      }
    }
    else {
      return ("Property does not exist");
    }
  };

    /**
     * Resets the key to null
     * @param key
     */
  this.unset = function(key) {
      data[key] = null;
  };

    /**
     * Saves the object in the table by
     * making an API call
     *
     */
  this.save = function(callback) {
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    //prepare object to pass to api call
    var postData = {};
    for(var key in data){
      postData[key] = data[key];
    }
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

  };


  this.fetch = function(callback) {
      var url = baseUrl + "objectmgr/api/collections/" + rowTable + "/" + rowObjectId;
      var headers = {
          'X-Moback-Environment-Key': envKey,
          'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
          callback(res);
          for(var key in res){
              data[key] = res[key];
          }
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

};
