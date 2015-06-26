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