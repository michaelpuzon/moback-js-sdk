/**
 * Complete Test of JavaScript Object Manager
 */

/**
 * Test Initialize method
 */
describe("Testing Moback Objects Manager", function(){
    var mobackTestObject;
    var mobackTestObject2;
    var mobackTestObjectPointer;
    var moObj = {
        "movieName" : "The Imitation Game"
    };
    var objData = {};

    /**
     * Test object instantiation of Objects Manager
     */
    it("should be able to instantiate a moback object", function(done) {
        mobackTestObject = new Moback.objMgr("Actor");
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

    it("should be able to create a 2nd moback object in another table", function(done) {
      mobackTestObject2 = new Moback.objMgr("Movie");
      mobackTestObject2.set("name","Avengers");
      mobackTestObject2.save(function(data){
        console.log(data);
        expect(data).toBeTruthy();
        done();
      });
    });

    it("should be add a pointer from 1st moback object to second object", function(done) {
      mobackTestObject.set("movie", mobackTestObject2);
      mobackTestObject.save(function(data){
        console.log(data);
        expect(data).toBeTruthy();
        done();
      });
    });

    it("should fetch the original object and fetch the name from object pointer", function(done){
      mobackTestObjectPointer = new Moback.queryMgr('Actor');
      mobackTestObjectPointer.fetchSingle(mobackTestObject.id, function(actor){
        console.log("Fetching a single object");
        //console.log(data);
        var moviePointer = actor.get('movie');
        moviePointer.fetch(function(data){
          expect(moviePointer.get('name')).toEqual("Avengers");
          done();
        });
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

  it("should remove the 2nd object from the table", function(done){
    mobackTestObject2.remove(function(data){
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