/**
 * Complete Test of JavaScript Query Manager
 */



/**
 * Testing the complete query object
 */
describe("Moback Data Type Manager", function() {
  var mobackTestObject;
  var objData = {};
  var dateObj = {};
  var geoObj = {};

  /**
   * Test object instantiation of Objects Manager
   */
  it("should be able to instantiate a moback object", function(done) {
    mobackTestObject = new Moback.objMgr("DateTypes");
    expect(typeof mobackTestObject.createObject).toBe("function");
    done();
  });

  it("should create a new date object" ,function(){
    dateObj = new Moback.Date( new Date(1995, 11, 17) );
    expect(typeof dateObj.getValue).toBe("function");
    var getDateValue = dateObj.getValue();
    expect(getDateValue.__type).toBe("Date");
    expect(getDateValue.iso).toBe("1995-12-17T08:00:00.000Z");
  });

  it("should update created date object" ,function(){
    expect(typeof dateObj.setDate).toBe("function");
    dateObj.setDate( new Date(2008, 5, 25) );

    var getDateValue = dateObj.getValue();
    expect(getDateValue.iso).toBe("2008-06-25T07:00:00.000Z");
  });

  it("should set properties of the created object", function(){
    mobackTestObject.set("myDate",dateObj);
    var fromObjDate = mobackTestObject.get("myDate");
    expect(fromObjDate.iso).toBe("2008-06-25T07:00:00.000Z");
  });

  it("should create a new geopoint object" ,function(){
    geoObj = new Moback.GeoPoint( 11, 17 );
    expect(typeof geoObj.getValue).toBe("function");
    var geoValue = geoObj.getValue();
    expect(geoValue.__type).toBe("GeoPoint");
    expect(geoValue.lat).toBe(11);
    expect(geoValue.lon).toBe(17);
  });

  it("should update created date object" ,function(){
    expect(typeof geoObj.setGeoPoint).toBe("function");
    geoObj.setGeoPoint( 20, 52 );

    var geoValue = geoObj.getValue();
    expect(geoValue.lat).toBe(20);
    expect(geoValue.lon).toBe(52);
  });

  /**
   * To test set, unset and get methods
   */
  it("should set properties of the created object", function(){
    mobackTestObject.set("myDate",dateObj);
    var fromObjDate = mobackTestObject.get("myDate");
    expect(fromObjDate.iso).toBe("2008-06-25T07:00:00.000Z");
    mobackTestObject.set("myLocation", geoObj);
    var fromGeo = mobackTestObject.get("myLocation");
    expect(fromGeo.lat).toBe(20);
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
   * To test if the object can be deleted
   */
  it("should remove the object from the table", function(done){
    mobackTestObject.remove(function(data){
      console.log(data);
      expect(data.success).toEqual(true);
      done();
    })
  });


});