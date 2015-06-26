/**
 * Test Moback Global Object Instantiation
 */

describe("Moback Global object", function(){
    var appKey = "Yjk5NTYwZWUtNDY3My00YzQxLTkxMGMtNmIzMTc1N2I2NDU1";
    var devKey = "MGExYzM3YTUtN2M1My00MjRkLTk2Y2MtYjk2MDUyYzY1NDNl";

    it("should be able to instantiate moback object", function() {
        Moback.initialize(appKey, devKey);
        var appKeys = Moback.showAppKey();
        expect(appKeys.appKey).toBe(appKey);
    });
});
