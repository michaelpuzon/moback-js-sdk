/**
 * Test the user manager
 */

describe("Moback User Manager", function(){
  var mobackUser;
  var mobackUser2;
  var userData = {};
  var sessionToken = "";
  var timestamp = new Date().getTime();

    /**
     * Test Instantiation of User Manager
     */

    it("should be able to instantiate a moback user", function (done) {
      mobackUser = new Moback.userMgr();
      mobackUser2  = new Moback.userMgr();
      expect(typeof mobackUser.createUser).toBe("function");
      done();
    });

    /**
     * Test setting properties of the user
     */
    it("should set properties of the user", function(done){
        mobackUser.set("userId", "john" + timestamp);
        userData["userId"] = "john" + timestamp;
        mobackUser.set("password", "mypassword");
        userData["password"] = "mypassword";
        mobackUser.set("email", "john" + timestamp + "@moback.com");
        expect(mobackUser.get("email")).toBe("john" + timestamp + "@moback.com");
        userData["email"] = "john" + timestamp + "@moback.com";
        mobackUser.set("firstname", "John");
        expect(mobackUser.get("firstname")).toBe("John");
        userData["firstname"] = "John";
        mobackUser.set("lastname","Doe");
        userData["lastname"] = "Doe";
        done();
    });

    /**
     * Test user creation
     */
    it("should create a user", function (done) {
        mobackUser.createUser(function (data) {
            console.log(data);
            expect(data["code"]).toEqual('1000');
            done();
        })
    });

    /**
     * Test adding user with same userId
     */
    it("should not create user that already exists", function (done) {
        mobackUser.createUser(function (data) {
            console.log(data);
            expect(data).toEqual('User already created');
            done();
        })
    });

    /**
     * Test user login
     */
    it("should login the created user", function (done) {
        mobackUser2.login(userData['userId'], userData['password'], function (data) {
            expect(data.userId).toBeDefined();
            done();
        });
    });

    it("should get session of the user logged in",function(){
      sessionToken = mobackUser2.getSessionToken();
      expect(mobackUser2.getSessionToken()).toBeTruthy();
    });

    /**
     *  Test get user details
     */

    it("should get details of the user logged in after re logging in", function() {
      expect(mobackUser2.get('userId')).toEqual(userData['userId']);
      expect(mobackUser2.get('firstname')).toEqual(userData['firstname']);
      expect(mobackUser2.get('lastname')).toEqual(userData['lastname']);
    });


    /**
     *  Test reset password
     */

    xit("should send the user an email to reset password", function (done) {
        mobackUser.resetPassword(userData.email, function (data) {
            console.log(data);
            expect(data.message).toEqual("resetPassword Operation Successful");
            done();
        })
    });

    it("should set the property that needs to be updated", function(done){
      mobackUser2.set("lastname", "Mayer");
        userData["lastname"] = "Mayer";
        expect(mobackUser2.get("lastname")).toBe("Mayer");
        done();
    });

    /**
     * Test update user
     */
    it("should update the details of the user logged in", function (done) {
      mobackUser2.save(function (data) {
            console.log(data);
            expect(data["updatedAt"]).toBeDefined();
            done();
      })
    });

    it("should login with valid sessionToken", function (done) {
      expect(mobackUser.logout()).toEqual("User has been successfully logged out.");

      mobackUser.loginWithSessionToken(sessionToken, function (data) {
        //console.log(data);
        expect(userData["lastname"]).toEqual(mobackUser.get('lastname'));
        done();
      });
    });

    /**
     * Test User Logout
     */

   it("should log out the user", function () {
        expect(mobackUser.logout()).toEqual("User has been successfully logged out.");
   });

   it("should be able to login after logout", function (done) {
        mobackUser.login(userData['userId'], userData['password'], function (data) {
            console.log(data);
            expect(data.userId).toBeDefined();
            done();
        });
   });

    it("should delete a user", function (done) {
        mobackUser.deleteUser(function (data) {
            expect(data.code).toBe("1000");
            done();
        });
    });

    it("should not get user details for the deleted user", function () {
      expect(mobackUser.id).toBeFalsy();
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

