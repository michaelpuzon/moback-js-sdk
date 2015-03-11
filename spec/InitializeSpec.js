/**
 * Test Moback Global Object Instantiation
 */

describe("Moback Global object", function(){
    var appKey = "MDMzZGQxMWUtNDFiYy00YTkyLWJkMTMtNDk0YjZhYzg1NThk";
    var devKey = "NDczMjI5NWQtNjhkMi00ZDcwLWE4YzItYTQ2YzI2ZWI1YTMy";

    it("should be able to instantiate moback object", function() {
        Moback.initialize(appKey, devKey);
        var appKeys = Moback.showAppKey();
        expect(appKeys.appKey).toBe(appKey);
    });
});
