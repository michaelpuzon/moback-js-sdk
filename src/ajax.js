/*
 Copyright (c) 2008 Stefan Lange-Hegermann

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
/*
 * method - GET, POST PUT, DELETE
 * url - full url
 * headers - additional headers, optional
 * postData - postBody, optional
 * */
function microAjax(method, url, callbackFunction, headers, postData)
{
  this.bindFunction = function (caller, object) {
    return function() {
      return caller.apply(object, [object]);
    };
  };

  this.stateChange = function () {
    if (this.request.readyState == 4){
      var result = JSON.parse(this.request.responseText);
      this.callbackFunction(result);
    }
  };

  this.getRequest = function() {
    if (window.ActiveXObject)
      return new ActiveXObject('Microsoft.XMLHTTP');
    else if (window.XMLHttpRequest)
      return new XMLHttpRequest();
    return false;
  };

  this.postBody = (postData) ? JSON.stringify(postData) : "";

  this.callbackFunction=callbackFunction;
  this.url=url;
  this.request = this.getRequest();

  if(this.request) {
    var req = this.request;
    req.onreadystatechange = this.bindFunction(this.stateChange, this);
    //

    if (this.postBody!=="") {
      req.open(method, url, true);
      req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    } else {
      req.open(method, url, true);
    }
    req.setRequestHeader("Content-Type", "application/json");
    /*add any additional headers here*/
    if(headers){
      for(var key in headers){
        req.setRequestHeader(key, headers[key]);
      }
    }
    req.send(this.postBody);
  }
}