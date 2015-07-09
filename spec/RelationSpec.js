/**
 * Complete Test of JavaScript Relations in Object
 */

/**
 * Test Initialize method
 */
describe("Testing Moback Relations", function(){
  var mobackTestObject;
  var mobackTestObjectFetched;
  var objectId = {};
  var relObj1 = {};
  var relObj2 = {};
  var table2Relation = {};


    /**
     * Test object instantiation of Objects Manager
     */
    it("should be able to instantiate a moback object", function(done) {
      mobackTestObject = new Moback.objMgr("table1");
      expect(typeof mobackTestObject.createObject).toBe("function");
      done();
    });

    /**
     * To test set, unset and get methods
     */
    it("should set properties of the created object", function(){
        mobackTestObject.set("name","row number 1");
        expect(mobackTestObject.get("name")).toEqual("row number 1");
    });

    /**
     * To test if the object was successfully saved
     */
    it("should save an object" ,function(done){
        mobackTestObject.save(function(data){
          if(data.objectId){
            objectId = data.objectId;
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
           expect(objectId).toEqual(data.objectId);
           done();
        });
    });

    describe('Relations object', function(){

      /**
       * To test if the object was successfully saved
       */
      it("should be able save first sub object" ,function(done){
        relObj1 = new Moback.objMgr("table2");
        relObj1.set("name","sub-row number 2a");
        relObj1.save(function(data){
          expect(data.objectId).toBeTruthy();
          done();
        });
      });

      /**
       * To test if the object was successfully saved
       */
      it("should be able save second sub object" ,function(done){
        relObj2 = new Moback.objMgr("table2");
        relObj2.set("name","sub-row number 2b");
        relObj2.save(function(data){
          expect(data.objectId).toBeTruthy();
          done();
        });
      });

      it("should be create a relation object to table 2" ,function(){
        table2Relation = mobackTestObject.relation('table2');
        expect(typeof table2Relation.getSaved).toBe("function");
      });

      it("should add 2 objects to relation table 2" ,function(){
        var msg1 = table2Relation.add(relObj1);
        expect(msg1).toBe("item relation added");
        var msg2 = table2Relation.add(relObj2);
        expect(msg2).toBe("item relation added");
      });

      it("should save the current object with 2 relations on it" ,function(done){
        mobackTestObject.save(function(data){
          expect(data.updatedAt).toBeTruthy();
          done();
        });
      });

      it("should try fetching the saved object" ,function(done){
        mobackTestObjectFetched = new Moback.objMgr("table1");
        mobackTestObjectFetched.id = objectId;
        mobackTestObjectFetched.include('table2');
        mobackTestObjectFetched.fetch(function(data){
          console.log(data);
          expect(data.objectId).toBeTruthy();
          done();
        });
      });

      it("relation pointers should show up on fetched object" ,function(){
        table2Relation = mobackTestObjectFetched.relation('table2');
        var savedRelations = table2Relation.getSaved();
        expect(savedRelations.length).toBeGreaterThan(0);
        expect(savedRelations[0].id).toBe(relObj1.id);
        expect(savedRelations[1].id).toBe(relObj2.id);
        expect(savedRelations[0].get('name')).toBeTruthy();
        expect(savedRelations[1].get('name')).toBeTruthy();
      });


    });

    /**
     * To test if the object can be deleted
     */
    it("should remove the object from the table", function(done){
        mobackTestObject.remove(function(data){
            expect(data.success).toEqual(true);
            done();
        })
    });



  it("should drop table2", function(done){
    var mobackQuery = new Moback.queryMgr('table2');
    mobackQuery.dropTable(function(data){
      console.log(data);
      expect(data.hasOwnProperty("success")).toBeFalsy();
      done();
    })
  });

});