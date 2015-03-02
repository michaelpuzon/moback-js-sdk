/**
 * Complete Test of JavaScript Object Manager
 */

/**
 * Test Initialize method
 */
describe("Moback Global object", function(){
    it("should be able to instantiate moback object", function() {
        Moback.initialize(
            "ODVkM2ZmODEtNmVhMS00MDU5LTg5NzQtMzg2ODU2MzVmMTdl",
            "MWUyN2RjMDAtOWUwMC00ODQ4LTk1MTMtZTZlNWFhMTlhNjQ0"
        );
        var appKeys = Moback.showAppKey();
        expect(appKeys.appKey).toBe("ODVkM2ZmODEtNmVhMS00MDU5LTg5NzQtMzg2ODU2MzVmMTdl");
    });
});

describe("Testing Moback Object Manager", function(){
    var mobackTestObject;
    var moObj = {
        "movieName" : "The Imitation Game"
    };

    it("should be able to instantiate a moback object", function() {
        mobackTestObject = new Moback.objMgr("Movie");
        expect(typeof mobackTestObject.createObject).toBe("function");
    });

    it("should set properties of the created object", function(done){
        mobackTestObject.set("Lead","Benedict Cumberbatch");
        expect(mobackTestObject.get("Lead")).toEqual("Benedict Cumberbatch");
        mobackTestObject.unset("Lead");
        expect(mobackTestObject.get("Lead")).toEqual("Property does not exist");
        done();
    });

    it("should save an object" ,function(done){
        mobackTestObject.save(function(data){
            console.log(data);
        })
    })


});