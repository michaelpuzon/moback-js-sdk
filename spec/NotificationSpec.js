describe("Moback Notification Manager", function() {

  var mobackNotification;
  var mobackUser;
  var userData = {};
  var timestamp = new Date().getTime();
  var userObj = {
    "userId": "user" + timestamp,
    "password": "asdf1234",
    "email": "mike" + timestamp + "@gmail.com",
    "firstname": "Uday",
    "lastname": "nayak"
  };

  describe("create a temporary user to send notifications to", function(){
    it("should create a user", function (done) {
      mobackUser = new Moback.userMgr();
      for(var key in userObj){
        mobackUser.set(key, userObj[key]);
      }
      mobackUser.createUser(function (data) {
        for (var prop in data) {
          userData[prop] = data[prop];
        }
        expect(data.code).toBe("1000");
        done();
      })
    });

    /**
     * Test user login
     */
    it("should login the created user", function (done) {
      mobackUser.login(userObj.userId, userObj.password, function (data) {
        for (var prop in data) {
          userData[prop] = data[prop];
        }
        console.log(data);
        expect(userData.ssotoken).toBeDefined();
        done();
      });
    });
  });

  it("should be able to instantiate a moback notification obj", function () {
    mobackNotification = new Moback.notificationMgr();
    expect(typeof mobackNotification.sendSingleUserNotification).toBe("function");
  });

  it("should be able to send a moback notification to a user", function (done) {
    var receiverId = userObj.userId;
    var alertMessage = "test alert message";
    mobackNotification.sendSingleUserNotification(receiverId, alertMessage, function(data){
      expect(data.code).toBeTruthy();
      done();
    });
  });

  it("should be able to send a moback notification to all users", function (done) {
    var alertMessage = "test alert message to all";
    mobackNotification.sendAllNotification(alertMessage, function(data){
      expect(data.code).toBeTruthy();
      done();
    });
  });

  it("should delete the create user sent with notification", function (done) {
    mobackUser.deleteUser(function (data) {
      console.log(data);
      expect(data.hasOwnProperty("success")).toBeTruthy();
      done();
    });
  });
});