
describe("Moback Global object", function(){
  it("should be able to instantiate moback object", function() {
    Moback.initialize(
      "ODVkM2ZmODEtNmVhMS00MDU5LTg5NzQtMzg2ODU2MzVmMTdl",
      "MWUyN2RjMDAtOWUwMC00ODQ4LTk1MTMtZTZlNWFhMTlhNjQ0"
    );
    var appKeys = Moback.showAppKey();
    expect(appKeys.appKey).toBe("ODVkM2ZmODEtNmVhMS00MDU5LTg5NzQtMzg2ODU2MzVmMTdl");
  });
});

describe("Moback User Manager Complete Test", function(){
  var mobackUser;
  var userData = {};
  var timestamp = new Date().getTime();
  var userObj = {
    "userId":"user" + timestamp,
    "password":"asdf1234",
    "email":"mike" + timestamp + "@gmail.com",
    "firstname":"Uday",
    "lastname":"nayak"
  };
  var updObj = {
      firstname:"Mike",
      password:"jasmine"
  };

  /**
   * Test Instatntiation of User Manager
   */

  it("should be able to instantiate a moback user", function() {
    var mobackTestUser = new Moback.userMgr();
    expect(typeof mobackTestUser.createUser).toBe("function");
  });

  /**
   * Test user creation
   */
  it("Should create a user",function(done){
    mobackUser = new Moback.userMgr();
    mobackUser.createUser(userObj,function(data){
        for(var prop in data) {
            userData[prop] = data[prop];
        }
        expect(data.objectId).toBeTruthy();
        done();
    })
  });

  /**
   * Test user login
   */

  it("Should login the created user",function(done){
      mobackUser.login(userObj.userId,userObj.password,function(data){
          for(var prop in data) {
              userData[prop] = data[prop];
          }
          console.log(data);
          expect(userData.ssotoken).toBeDefined();
          done();
      });
  });

  /**
   *  Test get user details
   */

  it("Should get details of the user logged in",function(done){
      mobackUser.getUserDetails(function(data){
          for(var prop in data) {
              userData[prop] = data[prop];
          }
          console.log(data);
          expect(userData.objectId).toEqual(data.objectId);
          done();
      })
  });

  /**
   *  Test reset password
   */

  it("Should send the user an email to reset password", function(done){
        mobackUser.resetPassword(userData.email,function(data){
          console.log(data);
          expect(data.message).toEqual("resetPassword Operation Successful");
          done();
      })
  });

  /**
   * Test update user
   */

  it("Should update the details of the user logged in",function(done){
      mobackUser.updateUser(updObj,function(data){
          console.log(data);
          mobackUser.getUserDetails(function(data){
             expect(data.firstname).toEqual(updObj.firstname);
             expect(data.password).toEqual(updObj.password);
          });
          expect(data.updatedAt).toBeDefined();
          done();
      })
  });

  /**
   * Test sending invites
   */

/*  it("Should send invites", function(done){
      mobackUser.sendInvite("sunainap@moback.com", userData.ssotoken, function(data){
              console.log(userData.ssotoken);
              done();
      })
  });*/

});



