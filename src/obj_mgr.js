moback.objMgr = function (table) {
  var rowObjectId = false;
  var rowTable = table;
  var data = {};
  var self = this;

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
        self.set(prop, existingObj[prop]);
      }
    }
  };


    /**
     * Sets the properties of the object
     * @param key
     * @param value
     */
  this.set = function(key, value) {
    data[key] = value;
      return("Property set");
  };

    /**
     * Returns the value of the property passed to this method
     * @param key
     * @returns {*}
     */
  this.get = function(key) {
     if(data[key]) {
         return data[key];
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
        }, headers, data);
    } else if (rowObjectId && rowTable){
      var url = baseUrl + "objectmgr/api/collections/" + rowTable + "/" + rowObjectId;
      microAjax('PUT', url, function (res) {
          callback(res);
      }, headers, data);
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
