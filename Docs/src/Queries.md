Queries
=======

The moback.queryMgr allows us to retrieve objects in many ways. At once, many objects can be retrieved with one or more conditions.
Instantiate moback query by passing the tablename to the constructor.

               var mobackQuery = new Moback.queryMgr('Cars');

Query Constraints
-----------------

There are several ways to add constraints on the objects. Use the fetch method to retrieve records after applying constraints.

               mobackQuery.fetch(function(data) {
                    console.log(data);
               });

The query constraints can be reset by using the 'reset' method.

               mobackQuery.resetFilters(); // Reset the filters

You can filter out objects with a particular key-value pair with
notEqualTo:

               mobackQuery.notEqualTo("carMake","Honda"); // Finds objects with Honda as carMake

You can also use multiple constraints, by default the operation is 'and':

               mobackQuery.notEqualTo("carMake","Honda"); // Finds objects that are not Honda
               mobackQuery.greaterThan("carYear","2000"); // And Finds all objects made after 2000

You can set limit to the number of results by setting a limit.

               mobackQuery.limit(3); // Limit to 3 records

You can skip the a few records by setting skip:

               mobackQuery.skip(3); // Skip first 3 records

For the numbers, you can sort the records returned:

               mobackQuery.ascending("carPrice"); // Sorts in ascending order of the car's price
               mobackQuery.descending("carPrice"); // Sorts in descending order of the car's price

Comparisons can also be used:

               mobackQuery.lessThan("carPrice", "25000"); // Finds objects with car price less than 25000
               mobackQuery.lessThanOrEqualTo("carPrice","20000"); // Finds objects with car price less than or equal to 20000
               mobackQuery.greaterThan("carPrice", "30000"); // Finds objects with car price greater than 30000
               mobackQuery.greaterThanOrEqualTo("carPrice", "40000"); // Finds objects with car price greater than  or equal to 40000

To retrieve objects matching different values, containedIn can be used:

               mobackQuery.containedIn("carMake", ["Honda", "Tesla"]); // Finds objects that are Honda and tesla

To retrieve objects that do not match any values, notContainedIn can be used:

               mobackQuery.notContainedIn("carMake", ["Honda", "Tesla"]); // Finds objects that are not Honda and Tesla

Query condition('and' or 'or')  between constraints can be set using the queryMode method.

               mobackQuery.queryMode('or'); // Sets the query operator between constraints to 'or'

If you want to retrieve objects that have a particular key set, you can use exists.
Conversely, if you want to retrieve objects without a particular key set, you can use doesNotExist.

               mobackQuery.exists('carMake'); // Finds objects that have carMake set
               mobackQuery.doesnotExist('carYear'); // Finds objects that do not have carMake set

Object Count
------------

To get the count of objects in the table, use the getCount method.

               mobackQuery.getCount(function (data) {
                    console.log(data); // Returns the count of objects in the table
               });