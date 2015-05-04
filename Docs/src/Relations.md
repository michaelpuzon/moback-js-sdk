Object Relations
=================

Moback also supports relations for one to many, or many to one relationships within Moback Objects.


Adding a Relation
-----------------
The following code shows how to add a relation from one moback object, to another:
```javascript
  //create a car object 
  var mobackCarObject = new Moback.objMgr("Car");
  mobackCarObject.set("make","Honda");
  
  //create an owner object 
  var mobackOwnerObject = new Moback.objMgr("Owner");
  mobackOwnerObject.set("name","Phil");
 
  
  //add the relation
  var carsOwned = mobackOwnerObject.relation('cars');
  carsOwned.add(mobackCarObject);                
```
             
Removing a Relation
-------------------
Simply call the remove function on the relation object, to remove a relation
```javascript
   var carsOwned = mobackOwnerObject.relation('cars');;
   carsOwned.remove(mobackCarObject);
```
             
Retrieve relations
-------------------
You have two functions for your disposal to retrieve relations

Inspect function lets you inspect the current relation chain    
```javascript
   var carsOwned = mobackOwnerObject.relation('cars');
   var carRelations = carsOwned.inspect();
```

getSaved function lets you just get relations, that are already saved    
```javascript
   var carsOwned = mobackOwnerObject.relation('cars');
   var carRelations = carsOwned.getSaved();
```
