Queries
=======

The moback.queryMgr allows us to retrieve objects in many ways. At once, many objects can be retrieved with one or more conditions.
Instantiate moback query by passing the tablename to the constructor.

               var mobackQuery = new Moback.queryMgr('Cars');

Query Constraints
-----------------

There are several ways to add constraints on the objects. You can filter out objects with a particular key-value pair with
notEqualTo:

               mobackQuery.notEqualTo("carMake","Honda");

You can also use multiple constraints:

               mobackQuery.notEqualTo("carMake","Honda");
               mobackQuery.greaterThan("carYear","2000");

You can set limit to the number of results by setting a limit.

               mobackQuery.limit(3); //Limit to 3 records

You can skip the a few records by setting skip:

               mobckQuery.skip(3); //Skip first 3 records

For the numbers, you can sort the records returned:

               mobackQuery.ascending("carPrice");
               mobackQuery.descending("carPrice");

Comparisons can also be used:

               mobackQuery.lessThan("carPrice", "25000");
               mobackQuery.lessThanOrEqualTo("carPrice","20000");
               mobackQuery.greaterThan("carPrice", "30000");
               mobackQuery.greaterThanOrEqualTo("carPrice", "40000");

To retrieve objects matching different values, containedIn can be used:

               mobackQuery.containedIn("carMake", ["Honda", "Tesla"]);

To retrieve objects that do not match any values, notContainedIn can be used:

               mobackQuery.notContainedIn("carMake", ["Honda", "Tesla"]);
