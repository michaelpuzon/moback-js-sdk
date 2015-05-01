Custom Data Types
=================

Besides native Javascript objects such as string, number, and objects, 
Moback also supports additional custom data types

Date
---------------
The following code shows the moback date object in action:
```javascript
  //to set a new date object, grabbing the current date
  var dateObj = new Moback.Date( new Date() );
  //modify the date later, set the date to an earlier date
  dateObj.setDate( new Date(1995, 11, 17 );
  
  //set the date to a Moback Object
  var mobackObject = new Moback.objMgr("DataTypes");
  mobackObject.set("myDate",dateObj);                
```
             
GeoPoint
---------------
The following code shows the moback date object in action:
```javascript
  //to set a new date object, grabbing the current date
  var geoObj = new Moback.GeoPoint( 10, 20 );
  //modify the date later, set the date to an earlier date
  geoObj.setGeoPoint( new Date(1995, 11, 17 );
  
  //set the date to a Moback Object
  var mobackObject = new Moback.objMgr("DataTypes");
  mobackObject.set("myLocation", geoObj);
```
             

