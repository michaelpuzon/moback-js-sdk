/**
 * File manager allows a file to be saved in the cloud, and be subquently used in moback objects.
 * @param fileName - filename to be used for the file
 * @param fileData - the actual file data
 */

moback.fileMgr = function (fileData) {

  var fileUrl = false;
  var fileName = false;
  /**
   * Creates an object in the table specified in the
   * @param callback
   */
  this.save = function (sessionToken, callback) {
    var formData = new FormData();
    console.log(fileData);
    formData.append('file', fileData);
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
   * Returns the name of the file
   * @returns {Name of the file}
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
   * @returns {URL of the file}
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
   * Deletes a file uploaded by the user
   * @param sessionToken
   * @param callback
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
