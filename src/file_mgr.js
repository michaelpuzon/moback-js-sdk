/**
 * File manager allows a file to be saved in the cloud, and be subquently used in moback objects.
 * @param fileName - filename to be used for the file
 * @param fileData - the actual file data
 */

moback.fileMgr = function (fileData) {

  /**
   * Creates an object in the table specified in the
   * @param callback
   */
  this.save = function (callback) {
    var formData = new FormData();
    console.log(fileData);
    formData.append('file', fileData);
    //console.log(formData);

    var url = baseUrl + "filemanager/api/files/upload";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey,
      //'X-Moback-SessionToken-Key': 'bWljaGFlbHArMkBtb2JhY2suY29tIy0xIzE0MjI1MTQ1MDAwMDA4NjQwMDAwMA=='
    };

    microAjax('PUT', url, function (res) {
      //on successful save, save the filename, and the url
      callback(res);
    }, headers, formData, true);
  };

  //create a remove function

};
