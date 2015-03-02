/**
 * Notification manager allows you to send notifications via the JS sdk.
 * It does not allow to receive notifications, at the moment.
 */
moback.notificationMgr = function(){

  /**
   * Sends a notification to a single user
   * @param receiverId - userId of receiver
   * @param notificationMessage
   * @param callback
   */
  this.sendSingleUserNotification = function(receiverId, notificationMessage, callback) {
    var notificationObj = {
      receiverId: receiverId,
      data:{
        alert: notificationMessage
      }
    };

    var url = baseUrl + "notificationmanager/api/alerts/push";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    microAjax('POST', url, function (res) {
      callback(res);
    }, headers, notificationObj);
  };

  this.sendAllNotification = function(notificationObj, callback) {
    //http://moback-stage-481937747.us-west-2.elb.amazonaws.com:8080/notificationmanager/api/alerts/push
    var url = baseUrl + "notificationmanager/api/alerts/push";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    microAjax('POST', url, function (res) {
      callback(res);
    }, headers, notificationObj);
  };

};