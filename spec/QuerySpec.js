/**
 * Complete Test of JavaScript Query Manager
 */



/**
 * Testing the complete query object
 */
describe("Moback Query Manager", function() {
  var mobackObjects = [];
  var mobackQuery, mobackQuerySecond;
  var timestamp = new Date().getTime();
  var objData = {};
  var leads = ['Kevin Spacey', 'Brad Pitt', 'George Clooney', 'Benedict Cumberbatch', 'Johnny Depp'];
  var genre = ['Thriller', 'Horror', 'Comedy', 'Drama','Romance'];
  var movies = ['Gone Girl', 'The Imitation Game', 'Its a Wonderful Life', 'The Illusionist', 'Sherlock'];


  /**
   * Test instatntiation of Moback Query object
   */
  it("should instantiate a Moback query object", function(done){
    mobackQuery = new Moback.queryMgr('Movie');
    mobackQuerySecond = new Moback.queryMgr('Movie');
    expect(typeof mobackQuery.fetch).toBe("function");
    done();
  });

  it("should drop the table before object creations", function(done){
    mobackQuery.dropTable(function(data){
      console.log(data);
      expect(data.hasOwnProperty("success")).toBeFalsy();
      done();
    })
  });


  describe("Create Moback Objects, to use the Query for later on", function(){
    /**
     * Test instantiation of a Moback object
     */
    it("should be able to instantiate a moback object", function(done) {
      for(var i=1; i<=10; i++) {
        mobackObjects[i] = new Moback.objMgr("Movie");
        expect(typeof mobackObjects[i].createObject).toBe("function");
      }
      done();
    });

    /**
     * Test set property
     */

    it("should set the properties of all the objects",function(done){
      var addNum = 100;
      var duration = 500;
      for(var j=1; j<=10;j++) {
        duration += addNum;
        mobackObjects[j].set("MovieName", movies[Math.floor(Math.random() * movies.length)]);
        if(Math.random() > 0.5){
          mobackObjects[j].set("Genre", genre[Math.floor(Math.random() * genre.length)]);
        }
        mobackObjects[j].set("Duration", duration);
        mobackObjects[j].set("Lead", leads[Math.floor(Math.random() * leads.length)]);
        console.log(mobackObjects[j].get("MovieName"));
        expect(mobackObjects[j].get('Duration')).toEqual(duration);
      }
      done();
    });


    /**
     * Test saving objets
     */

    it("should save all the objects",function(done){
      for(var k=1;k<=10;k++){
        mobackObjects[k].save(function (data) {
          expect(data.objectId).toBeTruthy();
          var counter = 1;
          mobackObjects[counter].set("objectId", data.objectId);
          counter++;
          done();
        });
      }
    });
  });

  /**
   * Test retreiving all objects
   */
  it("should retrieve all the objects in the table", function(done){
      mobackQuery.fetch(function(data){
          console.log("All the objects");
          console.log(data);
          expect(data.length).toEqual(10);
          done();
      });
  });

  /**
   * Test single object retrieval
   */
  it("should fetch a single object from the table", function(done){
      mobackQuery.fetchSingle((mobackObjects[1].get("objectId")),function(data){
          console.log("Fetching a single object");
          console.log(data);
          expect(data.objectId).toEqual(mobackObjects[1].objectId);
          done();
      });
  });

  /**
   * Test record count retrieval
   */
  it("should get count of the number of records in the table", function(done){
      mobackQuery.getCount(function(data){
          expect(data).toEqual(10);
          done();
      })
  });

  /**
   * Test equalTo filter
   */
  it("should set equal to filter",function(done){
      mobackQuery.equalTo("Lead","Benedict Cumberbatch");
      mobackQuery.fetch(function(data){
          console.log("Records with the actor - Benedict Cumberbatch");
          console.log(data);
          var check = data.length;
          if(check == 0) {
              expect(data.length).toEqual(0);
          }
          for(var z=0; z < check; z++) {
              expect(data[z].get("Lead")).toEqual("Benedict Cumberbatch");
          }
          done();
      })
  });

  /**
   * Reset filters after every test
   */
  it("should reset all the filter",function(done){
     expect(mobackQuery.resetFilters()).toEqual("filters reset");
     done();
  });

  /**
   * Test notEqualTo filter
   */
  it("should set not equal to filter",function(done){
      mobackQuery.notEqualTo("Genre","Thriller");
      mobackQuery.fetch(function(data){
          console.log("Movies that are not thrillers");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check; z++) {
              expect(data[z].get("Genre")).not.toEqual('Thriller');
          }
          done();
      })
  });

  /**
   * Reset filters after every test
   */
  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test greaterThan filter
   */
  it("should fetch all the movies with unrealistic duration", function(done){
      mobackQuery.greaterThan("Duration",1000);
      mobackQuery.fetch(function(data){
          console.log("Movies with duration more than  1000 minutes");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check; z++) {
              expect(data[z].get("Duration")).toBeGreaterThan(1000);
          }
          done();
      })
  });

  /**
   * Reset filters after every test
   */
  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test less/than filter
   */
  it("should fetch all the movies with unrealistic duration", function(done){
      mobackQuery.lessThan("Duration",1000);
      mobackQuery.fetch(function(data){
          console.log("Movies with duration less than 1000 minutes");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check; z++) {
              expect(data[z].get("Duration")).toBeLessThan(1000);
          }
          done();
      })
  });

  /**
   * Reset filters after every test
   */
  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test greaterThanOrEqualTo filter
   */
  it("should fetch all the movies with unrealistic duration", function(done){
      mobackQuery.greaterThanOrEqualTo("Duration",1000);
      mobackQuery.fetch(function(data){
          console.log("Movies with duration greater than or equal to 10000 minutes");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check; z++) {
              expect((data[z].get("Duration")) >= 1000).toBeTruthy();
          }
          done();
      })
  });

  /**
   * Reset filters after every test
   */
  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test lessThanOrEqualTo filter
   */
  it("should fetch all the movies with unrealistic duration", function(done){
      mobackQuery.lessThanOrEqualTo("Duration",1000);
      mobackQuery.fetch(function(data){
          console.log("Movies with duration lesser than or equal to 10000 minutes");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check; z++) {
              expect((data[z].get("Duration")) <= 1000).toBeTruthy();
          }
          done();
      })
  });

  /**
   * Reset filters after every test
   */
  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test exists filter
   */
  it("should return rows which have values for the specified column", function(done){
      mobackQuery.exists("Genre");
      mobackQuery.fetch(function(data){
          console.log("Movies with genre values set");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check; z++) {
              console.log(data[z].get("Genre"));
              expect(data[z].get("Genre")).toBeTruthy();
          }
          done();
      })
  });

  /**
   * Reset filters after every test
   */
  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test doesNotExist filter
   */
  it("should return rows which do not have values set for the specified column",function(done){
      mobackQuery.doesNotExist("Genre");
      mobackQuery.fetch(function(data){
          console.log("Movies with genre values not set");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check; z++) {
              console.log(data[z].get("Genre"));
              expect(data[z].get("Genre")).toEqual("Property does not exist");
          }
          done();
      })
  });

  /**
   * Reset filters after every test
   */
  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test ascending filter
   */
  it("should retrieve records in ascending order", function(done){
      mobackQuery.ascending("Duration");
      mobackQuery.fetch(function(data){
          console.log("Movies in ascending order of the duration");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check -1; z++) {
              console.log(data[z].get("Duration"));
              expect((data[z].get("Duration")) > data[z+1].get("Duration"));
          }
          done();
      })
  });

  /**
   * Reset filters after every test
   */
  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test descending filter
   */
  it("should retrieve records in descending order", function(done){
      mobackQuery.descending("Duration");
      mobackQuery.fetch(function(data){
          console.log("Movies in descending order of the duration");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check-1; z++) {
              console.log(data[z].get("Duration"));
              expect((data[z].get("Duration")) < data[z+1].get("Duration"));
          }
          done();
      })
  });

  /**
   * Reset filters after every test
   */
  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test selection
   */
  it("should return the leads of all movies", function(done){
      mobackQuery.select(["Lead"]);
      mobackQuery.fetch(function(data){
          console.log("Leads of all movies");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check-1; z++) {
              expect(data[z].get("Duration")).toEqual("Property does not exist");
              expect(data[z].get("Lead")).toBeTruthy();
          }
          done();
      })
  });

  /**
   * Reset filters after every test
   */

  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test containedIn filter
   */
  it("should filter columns that contain the given values", function(done){
     mobackQuery.containedIn("Lead", ["Brad Pitt"]);
     mobackQuery.fetch(function(data){
          console.log("Movies with leads Brad Pitt");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check-1; z++) {
              expect(data[z].get("Lead")).toEqual("Brad Pitt");
          }
          done();
     })
  });

  /**
   * Reset all filters
   */
  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test notContainedIn filter
   */
  it("should filter columns that contain the given values", function(done){
      mobackQuery.notContainedIn("Genre", "Thriller");
      mobackQuery.fetch(function(data){
          console.log("Movies that are not thrillers");
          console.log(data);
          var check = data.length;
          for(var z=0; z < check-1; z++) {
              expect(data[z].get("Genre")).not.toEqual("Thriller");
          }
          done();
      })
  });

  /**
   * Reset all filters
   */
  it("should reset all the filter",function(done){
      expect(mobackQuery.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test limit
   */
  it("should set the limit and fetch records the correct number of records", function(done){
      mobackQuerySecond.limit(3);
      mobackQuerySecond.fetch(function(data){
          console.log("Movies with limit set to 3");
          console.log(data);
          expect(data.length).toEqual(3);
          done();
     })
  });

  /**
   * Reset all filters
   */
  it("should reset all the filter",function(done){
      expect(mobackQuerySecond.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test skip
   */
  it("should skip the first few records", function(done){
      mobackQuerySecond.skip(3);
      mobackQuerySecond.greaterThanOrEqualTo("Duration", 1000);
      mobackQuerySecond.fetch(function(data){
          console.log("Movies after skipping first 3");
          console.log(data);
          expect(data.length).toEqual(3);
          done();
      })
  });

  /**
   * Reset all filters
   */
  it("should reset all the filter",function(done){
      expect(mobackQuerySecond.resetFilters()).toEqual("filters reset");
      done();
  });

  /**
   * Test query mode
   */
  it("should set the query mode", function(done){
      mobackQuerySecond.equalTo("Lead","Benedict Cumberbatch");
      mobackQuerySecond.equalTo("Genre","Thriller");
      mobackQuerySecond.queryMode('or');
      mobackQuerySecond.fetch(function(data){
           console.log("Testing query mode");
           console.log(data);
           var check = data.length;
           for(var z=0; z < check; z++) {
               expect(data[z].get("Lead")).toEqual("Benedict Cumberbatch") ||
               expect(data[z].get("Genre")).toEqual("Thriller");
           }
           done();
     })
  });

  /**
   * Test dropping the table after running all tests
   */
  it("should drop the table", function(done){
      mobackQuery.dropTable(function(data){
          console.log(data);
          expect(data.hasOwnProperty("success")).toBeFalsy();
          done();
      })
  })
});