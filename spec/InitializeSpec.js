/**
 * Test Moback Global Object Instantiation
 */

describe("Moback Global object", function(){
    var appKey = "ODVkM2ZmODEtNmVhMS00MDU5LTg5NzQtMzg2ODU2MzVmMTdl";
    var devKey = "MWUyN2RjMDAtOWUwMC00ODQ4LTk1MTMtZTZlNWFhMTlhNjQ0";

    it("should be able to instantiate moback object", function() {
        Moback.initialize(appKey, devKey);
        var appKeys = Moback.showAppKey();
        expect(appKeys.appKey).toBe(appKey);
    });
});
