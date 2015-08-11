/**
 * Notification manager allows you to send notifications to users via the JS sdk.
 * It does not allow to receive notifications, at the moment.
 * @constructor
 */
moback.notificationMgr = function(){

  /**
   * Sends a notification to a single user
   * @param {String} receiverId given userId of receiver
   * @param {String} notificationMessage
   * @param {Function} callback
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

  /**
   * Sends a notification to all users in the app
   * @param {String} notificationMessage
   * @param {Function} callback
   */
  this.sendAllNotification = function(notificationMessage, callback) {
    var toPost = {
      data:{
        alert: notificationMessage
      }
    };
    toPost.channels = ['__default'];
    var url = baseUrl + "notificationmanager/api/alerts/push";
    var headers = {
      'X-Moback-Environment-Key': envKey,
      'X-Moback-Application-Key': appKey
    };
    microAjax('POST', url, function (res) {
      callback(res);
    }, headers, toPost);
  };

};