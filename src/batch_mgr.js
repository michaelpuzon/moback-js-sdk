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
    var url = baseUrl + "objectmgr/api/collections/batch/" + table;
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };

    var postData = parseMobackSaveObjects();

    microAjax('DELETE', url, function (res) {
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
    return {objectIds : mobackSaveObjs};
  }



};