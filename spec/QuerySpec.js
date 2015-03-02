describe("Moback Query Manager", function() {

  describe("Moback Global object", function(){
    var appKey = "MDMzZGQxMWUtNDFiYy00YTkyLWJkMTMtNDk0YjZhYzg1NThk";
    var devKey = "NDczMjI5NWQtNjhkMi00ZDcwLWE4YzItYTQ2YzI2ZWI1YTMy";

    it("should be able to instantiate moback object", function() {
      Moback.initialize(appKey, devKey);
      var appKeys = Moback.showAppKey();
      expect(appKeys.appKey).toBe(appKey);
    });
  });

  var mobackObject, mobackQuery;
  var timestamp = new Date().getTime();


  it("should be able to query a single obj", function (done) {
    mobackQuery = new Moback.queryMgr('filetester');
    mobackQuery.fetchSingle('VPCvSeSw_NObCo9v', function(data){
      mobackObject = data;
      console.log(mobackObject);
      expect(mobackObject.id).not.toBeUndefined();
      done();
    });
  });

  it("should be able to set date param to nothing", function (done) {
    mobackObject.set("point", {});
    mobackObject.save(function(data){
      console.log(data);
      expect(data.updatedAt).not.toBeUndefined();
      done();
    });

  });

});