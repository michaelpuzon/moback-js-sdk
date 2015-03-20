Objects
=======

Moback.objMgr
-------------

Storing data on Moback is built around Moback.ObjMgr. Each object contains key-value pairs of JSON-compatible data.
This data is schemaless, which means that you don't need to specify what keys exist on each object.

For example, let's say you have a car store. a single object could contain:

            { carMake: "Honda", carColor:"Red", carYear:"2005", carPrice="50,000" }

Instantiation
-------------

To instantiate a moback object, pass the name of the table to the constructor as below.

            var mobackObject = new Moback.objMgr("Car");

Here, 'Car' is the name of the table.

Save objects
------------

To save a car object described above. First set the values of the keys using the 'set' method and then use the 'save' method.

            mobackObject.set("carMake","Honda");
            mobackObject.set("carColor","Red");
            mobackObject.set("carYear","2005");
            mobackObject.set("carPrice","2005");
            mobackObject.save(function(data){
                console.log(data);
            });

Properties can also be unset using the unset method.

            mobackObject.unset("carPrice"); //carPrice property will not hold a value

Properties can be retrieved using the get method.

            mobackObject.get("carMake"); // Returns 'Honda'


Retrieve Objects
----------------

To retrieve an object from the cloud, use the fetch method.

            mobackObject.fetch(function(data){
               console.log(data);
            });


Delete Objects
--------------

To delete an object from the cloud, use the remove method.

            mobackObject.remove(function(data){
                console.log(data);
            });