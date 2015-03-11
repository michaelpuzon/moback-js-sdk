/**
 * Test the user manager
 */


describe("Moback User Manager Complete Test", function() {
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
    var updObj = {
        firstname: "Mike",
        password: "jasmine"
    };


    /**
     * Test Instantiation of User Manager
     */

    it("should be able to instantiate a moback user", function () {
        var mobackTestUser = new Moback.userMgr();
        expect(typeof mobackTestUser.createUser).toBe("function");
    });

    /**
     * Test user creation
     */
    it("should create a user", function (done) {
        mobackUser = new Moback.userMgr();
        mobackUser.createUser(userObj, function (data) {
            for (var prop in data) {
                userData[prop] = data[prop];
            }
            expect(data.objectId).toBeTruthy();
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

    /**
     *  Test get user details
     */

    it("should get details of the user logged in", function (done) {
        mobackUser.getUserDetails(function (data) {
            for (var prop in data) {
                userData[prop] = data[prop];
            }
            console.log(data);
            expect(userData.objectId).toEqual(data.objectId);
            expect(userData.email).toEqual(data.email);
            done();
        });
    });

    /**
     *  Test reset password
     */

    it("should send the user an email to reset password", function (done) {
        mobackUser.resetPassword(userData.email, function (data) {
            console.log(data);
            expect(data.message).toEqual("resetPassword Operation Successful");
            done();
        })
    });

    /**
     * Test update user
     */

    it("should update the details of the user logged in", function (done) {
        mobackUser.updateUser(updObj, function (data) {
            console.log(data);
            expect(data.updatedAt).toBeDefined();
            it("Should match details of the user when fecthed", function (done) {
                mobackUser.getUserDetails(function (data) {
                    expect(data.firstname).toEqual(updObj.firstname);
                    expect(data.password).toEqual(updObj.password);
                    done();
                });
            });
            done();
        })
    });


    /**
     * Test User Logout
     */
    it("should log out the user", function (done) {
        expect(mobackUser.logout()).toEqual("User has been successfully logged out.");
        it("should not return user details when logged out", function (done) {
            expect(mobackUser.getUserDetails()).toEqual("User object id is not set, please login or create user first");
            done();
        });

        done();
    });


    it("should be able to login after logout", function (done) {
        mobackUser.login(userObj.userId, userObj.password, function (data) {
            for (var prop in data) {
                userData[prop] = data[prop];
            }
            console.log(data);
            expect(userData.ssotoken).toBeDefined();
            done();
    });


    it("should delete a user", function (done) {
        mobackUser.deleteUser(function (data) {
            console.log(data);
            expect(data.hasOwnProperty("success")).toBeTruthy();
            done();
        });
    });

    it("should not get user details for the deleted user", function (done) {
        expect(mobackUser.getUserDetails(function (data) {
            console.log(data);
        })).toBeUndefined();
        done();
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

});

