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
