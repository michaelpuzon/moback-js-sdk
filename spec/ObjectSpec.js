/**
 * Complete Test of JavaScript Object Manager
 */

/**
 * Test Initialize method
 */
describe("Testing Moback Objects Manager", function(){
    var mobackTestObject;
    var moObj = {
        "movieName" : "The Imitation Game"
    };
    var objData = {};

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
    it("should set properties of the created object", function(done){
        mobackTestObject.set("Lead","Benedict Cumberbatch");
        expect(mobackTestObject.get("Lead")).toEqual("Benedict Cumberbatch");
        mobackTestObject.unset("Lead");
        expect(mobackTestObject.get("Lead")).toBe(null);
        mobackTestObject.set("lead","Benedict Cumberbatch");
        expect(mobackTestObject.get("lead")).toEqual("Benedict Cumberbatch");
        mobackTestObject.set("genre","Thriller");
        expect(mobackTestObject.get("genre")).toEqual("Thriller");
        mobackTestObject.set("duration","30 Minutes");
        done();
    });

    /**
     * To test if the object was successfully saved
     */
    it("should save an object" ,function(done){
        mobackTestObject.save(function(data){
            console.log(data);
            for(var prop in data) {
                objData[prop] = data[prop];
            }
            expect(data.objectId).toBeTruthy();
            done();
        });
    });


    /**
     * To test if the created object can be fetched
     */
    it("should fetch an existing object", function(done){
        mobackTestObject.fetch(function(data){
           console.log(data);
           expect(objData.objectId).toEqual(data.objectId);
           done();
        });
    });

    /**
     * To test if the object can be deleted
     */
    it("should remove the object from the table", function(done){
        mobackTestObject.remove(function(data){
            console.log(data);
            expect(data.success).toEqual(true);
            done();
        })
    });

    /**
     * To test that the deleted object can no more be fetched
     */
    it("should not be able to fetch the deleted object", function(done){
        mobackTestObject.fetch(function(data){
            console.log(data);
            expect(data.data).toBeDefined();
            done();
        });

    });
});