/**
 * Testing File Manager
 */

describe("Moback File Manager", function() {
    var timestamp = new Date().getTime();
    var mobackUser, mobackTestObject, mobackFileObject;
    var userData = {};
    var userObj = {
        "userId":"user" + timestamp,
        "password":"asdf1234",
        "email":"mike" + timestamp + "@gmail.com",
        "firstname":"Uday",
        "lastname":"nayak"
    };

    describe("create a moback user, so we can use that user's session when uploading an object", function(){
      /**
       * Test object instantiation of User Manager
       */
      it("should be able to instantiate a moback user", function() {
        var mobackTestUser = new Moback.userMgr();
        expect(typeof mobackTestUser.createUser).toBe("function");
      });

      /**
       * Test user creation
       */
      it("should create a user",function(done){
        mobackUser = new Moback.userMgr();
        for(var key in userObj){
          mobackUser.set(key, userObj[key]);
        }
        mobackUser.createUser(function(data){
          for(var prop in data) {
            userData[prop] = data[prop];
          }
          expect(data.code).toBe("1000");
          done();
        });
      });

      /**
       * Test user login
       */
      it("should login the created user",function(done){
        mobackUser.login(userObj.userId,userObj.password,function(data){
          for(var prop in data) {
            userData[prop] = data[prop];
          }
          console.log(data);
          expect(data.userId).toBeDefined();
          done();
        });
      });
    });

    /**
     * Test object instantiation of Objects Manager
     */
    it("should be able to instantiate a moback object", function(done) {
        mobackTestObject = new Moback.objMgr("Movie");
        expect(typeof mobackTestObject.createObject).toBe("function");
        done();
    });

    it("should be able to instantiate a moback file object", function() {
      var content = '<a id="a"><b id="b">hey!</b></a>'; // the body of the new file...
      var blob = new Blob([content], { type: "text/xml"});
      //mobackFile1 = new Moback.fileMgr(fileSelect.files[0]); //use this for a file object in a form
      mobackFileObject = new Moback.fileMgr(blob, "test.xml");

      expect(typeof mobackFileObject.save).toBe("function");
    });

    it("should be able to save a moback file object", function(done) {
      //a valid sso token is needed for saving a file
      var SSOToken = mobackUser.getSessionToken();
      mobackFileObject.save(SSOToken, function(data){
        expect(data.url).toBeTruthy();
        done();
      });
    });

    /**
     * To test set, unset and get methods
     */
    it("should set properties of the created object, including the file object", function(){
        mobackTestObject.set("Lead","Benedict Cumberbatch");
        expect(mobackTestObject.get("Lead")).toEqual("Benedict Cumberbatch");
        mobackTestObject.set("genre","Thriller");
        expect(mobackTestObject.get("genre")).toEqual("Thriller");
        mobackTestObject.set("duration","30 Minutes");
        mobackTestObject.set("MoviePic",mobackFileObject);
    });

    /**
     * To test if the object was successfully saved
     */
    it("should save an object with the file object attached" ,function(done){
        mobackTestObject.save(function(data){
          console.log(data);
          expect(data.objectId).toBeTruthy();
          done();
        });
    });

    describe('test cleanup, delete file, user, and object', function(){
      /**
       * Test remove file
       */
      it("should remove the uploaded file", function(done){
        var SSOToken = mobackUser.getSessionToken();
        mobackFileObject.removeFile(SSOToken, function(data){
          console.log(data);
          expect(data.code).toEqual("1000");
          done();
        });
      });

      /**
       * Test object deletion
       */

      it("should delete the object", function(done){
        mobackTestObject.remove(function(data){
          console.log(data);
          expect(data.success).toEqual(true);
          done();
        });
      });


      it("should delete a user", function (done) {
        mobackUser.deleteUser(function (data) {
          console.log(data);
          expect(data.code).toBe("1000");
          done();
        });
      });

    });



});