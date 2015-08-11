/**
 * Testing File Manager
 */

describe("Moback Role Manager", function() {
  var timestamp = new Date().getTime();
  var mobackUser, mobackTestObject, mobackACL, mobackRole1, mobackRole2;
  var userObj = {
    "userId":"user" + timestamp,
    "password":"asdf1234",
    "email":"mike+" + timestamp + "@gmail.com",
    "firstname":"Uday",
    "lastname":"nayak"
  };

  describe("create a moback user, so we can use that user for roles object", function(){
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

  describe("setup acl and roles", function(){

    it("should be able to instantiate a moback role", function() {
      mobackRole1 = new Moback.roleMgr('role1');
      expect(typeof mobackRole1.createRole).toBe("function");
      mobackRole2 = new Moback.roleMgr();
      expect(typeof mobackRole2.createRole).toBe("function");
    });

    it("should be able to assign a role name to a moback role", function() {
      mobackRole2.set('roleName', 'role2');
      expect(mobackRole1.get('roleName')).toBe("role1");
      expect(mobackRole2.get('roleName')).toBe("role2");
    });

    it("should be able to add user to a moback role", function() {
      var msg1 =  mobackRole1.users().add(mobackUser);
      expect(msg1).toBe("item relation added");
    });

    it("should save the role with a user on it" ,function(done){
      mobackRole1.save(function(data){
        expect(data.objectId).toBeTruthy();
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
  it("should be able to instantiate a moback object", function() {
    mobackTestObject = new Moback.objMgr("Movie");
    expect(typeof mobackTestObject.createObject).toBe("function");
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

  it("should be able to add role write acl rules to a moback acl", function() {
    var message = mobackACL.setRoleWritePermission('role1', true);
    expect(message).toBe("Role permission added");
    message = mobackACL.setRoleWritePermission('role1', true);
    expect(message).toBe("Role already in the permission list");
    message = mobackACL.setRoleWritePermission('role1', false);
    expect(message).toBe("Role write permission removed");
    message = mobackACL.setRoleWritePermission('role1', true);
    expect(message).toBe("Role permission added");
    //console.log(mobackACL.getInfo());
  });

  it("should be able to add role read acl rules to a moback acl", function() {
    var message = mobackACL.setRoleReadPermission('role1', true);
    expect(message).toBe("Role permission added");
    message = mobackACL.setRoleReadPermission('role1', true);
    expect(message).toBe("Role already in the permission list");
    message = mobackACL.setRoleReadPermission('role1', false);
    expect(message).toBe("Role read permission removed");
    message = mobackACL.setRoleReadPermission('role1', true);
    expect(message).toBe("Role permission added");
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

  describe('test cleanup, delete role, user, and object', function(){

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

    it("should delete a role", function (done) {
      mobackRole1.remove(function(data){
        console.log(data);
        expect(data.success).toEqual(true);
        done();
      });
    });

  });

});