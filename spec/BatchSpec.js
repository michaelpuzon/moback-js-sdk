/**
 * Complete Test of JavaScript Batch Manager
 */

/**
 * Test Initialize method
 */
describe("Testing Moback Batch Manager", function(){
  var mobackObj1;
  var mobackObj2;
  var mobackObj3;
  var mobackBatch;
  var mobackQuery;
  var mobackObjsFetched;


  it("should log out the user", function () {
    var mobackUser = new Moback.userMgr();
    expect(mobackUser.logout()).toEqual("User has been successfully logged out.");
  });

    /**
     * Test object instantiation of Objects Manager
     */
    it("should be able to instantiate all moback objects", function() {
      mobackObj1 = new Moback.objMgr("Actor");
      expect(typeof mobackObj1.createObject).toBe("function");
      mobackObj2 = new Moback.objMgr("Actor");
      expect(typeof mobackObj2.createObject).toBe("function");
      mobackObj3 = new Moback.objMgr("Actor");
      expect(typeof mobackObj3.createObject).toBe("function");
    });

    /**
     * To test set, unset and get methods
     */
    it("should set properties of the created object", function(){
      mobackObj1.set("Lead","Benedict Cumberbatch");
      expect(mobackObj1.get("Lead")).toEqual("Benedict Cumberbatch");
      mobackObj2.set("Lead","Hugh Grant");
      expect(mobackObj2.get("Lead")).toEqual("Hugh Grant");
      mobackObj3.set("Lead","Brad Pitt");
      expect(mobackObj3.get("Lead")).toEqual("Brad Pitt");
    });

    /**
     * Test object instantiation of Batch Manager
     */
    xit("should be able to instantiate moback batch object and add jobs", function() {
      mobackBatch = new Moback.batchMgr("Actor");
      expect(typeof mobackBatch.addJob).toBe("function");
      mobackBatch.addJob(mobackObj1);
      mobackBatch.addJob(mobackObj2);
      mobackBatch.addJob(mobackObj3);
    });

    /**
     * To test if the object was successfully saved
     */
    xit("should be able to batch save" ,function(done){
      mobackBatch.saveUpdateJobs(function(data){
        console.log(data);
        expect(data.batchResponse).toBeTruthy();
        done();
      });
    });


    /**
     * To test if the created object can be fetched
     */
    it("should fetch all existing object", function(done){
      mobackQuery = new Moback.queryMgr('Actor');
      mobackQuery.fetch(function(data){
        console.log("All the objects");
        console.log(data);
        mobackObjsFetched = data;
        expect(data.length).toBeGreaterThan(1);
        done();
      });
    });

    /**
     * To test if the object can be deleted
     */
    it("should batch remove objects", function(done){
      for (var i = 0; i < mobackObjsFetched.length; i++) {
        mobackBatch.addJob(mobackObjsFetched[i]);
      }

      mobackBatch.deleteJobs(function(data){
        console.log(data);
        expect(data.response).toBeTruthy();
        done();
      });
    });

});