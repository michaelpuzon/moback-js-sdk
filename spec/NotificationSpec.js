describe("Moback Notification Manager", function() {


  describe("Moback Global object", function(){
    var appKey = "MDMzZGQxMWUtNDFiYy00YTkyLWJkMTMtNDk0YjZhYzg1NThk";
    var devKey = "NDczMjI5NWQtNjhkMi00ZDcwLWE4YzItYTQ2YzI2ZWI1YTMy";

    it("should be able to instantiate moback object", function() {
      Moback.initialize(appKey, devKey);
      var appKeys = Moback.showAppKey();
      expect(appKeys.appKey).toBe(appKey);
    });
  });


  var mobackNotification;
  var userData = {};
  var timestamp = new Date().getTime();
  var userObj = {
    "userId": "user" + timestamp,
    "password": "asdf1234",
    "email": "mike" + timestamp + "@gmail.com",
    "firstname": "Uday",
    "lastname": "nayak"
  };
  var updObj = {
    firstname: "Mike",
    password: "jasmine"
  };

  it("should be able to instantiate a moback notification obj", function () {
    mobackNotification = new Moback.notificationMgr();
    expect(typeof mobackNotification.sendSingleUserNotification).toBe("function");
  });

  it("should be able to send a moback notification to a user", function () {
    var receiverId = 'user1424897571348';
    var alertMessage = "test alert message";
    mobackNotification.sendSingleUserNotification(receiverId, alertMessage, function(data){
      console.log(data);
      //expect(data.objectId).toBeTruthy();
      done();
    });

  });
});