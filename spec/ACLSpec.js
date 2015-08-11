/**
 * Testing File Manager
 */

describe("Moback ACL Manager", function() {
  var timestamp = new Date().getTime();
  var mobackUser, mobackTestObject, mobackACL;
  var userObj = {
    "userId":"user" + timestamp,
    "password":"asdf1234",
    "email":"mike+" + timestamp + "@gmail.com",
    "firstname":"Uday",
    "lastname":"nayak"
  };

  describe("create a moback user, so we can use that user for acl object", function(){
    /**
     * Test object instantiation of User Manager
     */
    it("should be able to instantiate a moback user", function() {
      mobackUser = new Moback.userMgr();
      expect(typeof mobackUser.createUser).toBe("function");
    });

    /**
     * Test user creation
     */
    it("should create a user",function(done){
      for(var key in userObj){
        mobackUser.set(key, userObj[key]);
      }
      mobackUser.createUser(function(data){
        expect(data.code).toBe("1000");
        done();
      });
    });


    /**
     * Test user login
     */
    it("should login the created user",function(done){
      mobackUser.login(userObj.userId, userObj.password, function(data){
        console.log(data);
        expect(data.userId).toBeDefined();
        done();
      });
    });
  });

  it("should be able to instantiate a moback acl object", function() {
    mobackACL = new Moback.aclMgr();
    expect(typeof mobackACL.getInfo).toBe("function");
  });

  it("should be able to set global read/write permission", function() {
    var message = mobackACL.setPublicWritePermission(true);
    expect(message).toBe("Public Permission set");
    message = mobackACL.setPublicReadPermission(false);
    expect(message).toBe("Public Permission set");
    mobackACL.setPublicReadPermission(true);
  });

  /**
   * Test object instantiation of Objects Manager
   */
  it("should be able to instantiate a moback object", function(done) {
    mobackTestObject = new Moback.objMgr("Movie");
    expect(typeof mobackTestObject.createObject).toBe("function");
    done();
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
  });

  it("should be able to add user write acl rules to a moback acl", function() {
    var userId = mobackUser.id;
    var message = mobackACL.setUserWritePermission(userId, true);
    expect(message).toBe("User permission added");
    message = mobackACL.setUserWritePermission(userId, true);
    expect(message).toBe("User already in the permission list");
    message = mobackACL.setUserWritePermission(userId, false);
    expect(message).toBe("User write permission removed");
    message = mobackACL.setUserWritePermission(userId, true);
    expect(message).toBe("User permission added");
    //console.log(mobackACL.getInfo());
  });

  it("should be able to add user read acl rules to a moback acl", function() {
    var userId = mobackUser.id;
    var message = mobackACL.setUserReadPermission(userId, true);
    expect(message).toBe("User permission added");
    message = mobackACL.setUserReadPermission(userId, true);
    expect(message).toBe("User already in the permission list");
    message = mobackACL.setUserReadPermission(userId, false);
    expect(message).toBe("User read permission removed");
    message = mobackACL.setUserReadPermission(userId, true);
    expect(message).toBe("User permission added");
    console.log(mobackACL.getInfo());
  });

  it("should be able to attach acl to moback object", function() {
    var message = mobackTestObject.setACL(mobackACL);
    expect(message).toBe("ACL for object set");
  });

  /**
   * To test if the object was successfully saved
   */
  it("should save an object with the acl permission attached attached" ,function(done){
    mobackTestObject.save(function(data){
      console.log(data);
      expect(data.objectId).toBeTruthy();
      done();
    });
  });

  describe('test cleanup, delete file, user, and object', function(){

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