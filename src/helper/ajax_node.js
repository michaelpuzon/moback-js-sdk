/**
 * microAjax node js version, for use in custom code express BE
 */
function microAjax(method, url, callbackFunction, headers, postData, fileMode){
  var request = require('request');
  var options = {
    method: method,
    uri: url,
    headers: headers
  };
  if(postData){
    if(fileMode){
      options.formData = postData;
    } else {
      options.body = postData;
      options.json = true;
    }
  }
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callbackFunction(body);
      console.log(body); // Show the response for the api
    } else{
      console.log(response); // Show the error response for the api
      callbackFunction(response);

    }
  });
};