
describe("Moback Global object", function(){
  it("should be able to instantiate moback object", function() {
    Moback.initialize(
      "MDMzZGQxMWUtNDFiYy00YTkyLWJkMTMtNDk0YjZhYzg1NThk",
      "NDczMjI5NWQtNjhkMi00ZDcwLWE4YzItYTQ2YzI2ZWI1YTMy"
    );
    var appKeys = Moback.showAppKey();
    expect(appKeys.appKey).toBe("MDMzZGQxMWUtNDFiYy00YTkyLWJkMTMtNDk0YjZhYzg1NThk");
  });
});

describe("Moback User Manager", function(){
  var mobackUser;

  it("should be able to instantiate a moback user", function() {
    mobackUser = new Moback.userMgr();

    expect(typeof mobackUser.createUser).toBe("function");
  });

  it("should be able to create a user", function() {
    var timestamp = new Date().getTime();

    var userObj = {
      "userId":"user" + timestamp,
      "password":"asdf1234",
      "email":"mike" + timestamp + "@gmail.com",
      "firstname":"Uday",
      "lastname":"nayak"
    };

    beforeEach(function(done) {
      //var u
      mobackUser.createUser(userObj, function(data){
        done
      });
        value = 0;
        done();
    });


      console.log(data);
      expect(data.createUser).toBeDefined();
      expect(data.objectId).toBeDefined();


    //
  });
});



