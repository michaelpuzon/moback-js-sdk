/**
 * The Query manager object. This object allows you to run all sorts of queries in a table.
 * Pass table parameter on query object creation to use right away.
 * If table parameter is omitted, please use set table function afterwards.
 * @param {String} table Table name to use for all query operations
 */
moback.queryMgr = function (table) {
  var baseUrlAPI = baseUrl + 'objectmgr/api/';
  var rowTable = table || false;
  var filters = [];
  var limit = false;
  var skip = false;
  var order = false;
  var keys = false;
  var includes = [];
  var queryMode = "and";

  /**
   * Change the table name currently being used by the query mgr object
   * @param {String} table New table name
   * @returns {string}
   */
  this.setTable = function (table) {
    rowTable = table;
    return "Query object has been changed to table " + table;
  };

  /**
   * Fetches an array of moback objects, based  on the current query parameters
   * @param {Function} callback
   */
  this.fetch = function (callback) {
    if (rowTable){
      var query = formQuery();
      var url = baseUrlAPI + "collections/" + rowTable + "?" + query;
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
        if(res.results){
          var objArray = [];
          for (var i = 0; i < res.results.length; i++) {
            var mobackObj = new moback.objMgr(rowTable);
            mobackObj.createFromExistingObject(res.results[i]);
            objArray.push(mobackObj);
          }
          callback(objArray);
        } else {
          callback(res);
        }
      }, headers);
    } else {
      callback("Query object is not set, please set a query object first");
    }
  };

  /**
   * Internal function to form the filters query
   */
  function formQuery(){
    var query = "where=";
    //if filters array is set, build the filters
    if(filters.length > 0){
      if(filters.length == 1){
        query = query + encodeURIComponent(JSON.stringify(filters[0]));
      } else {
        var objQueries = {};
        objQueries["$" + queryMode] = filters;
        query = query + encodeURIComponent(JSON.stringify(objQueries));
      }
    }
    if(limit){
      query = query + "&limit=" + limit;
    }
    if(skip){
      query = query + "&skip=" + skip;
    }
    if(order){
      query = query + "&order=" + order;
    }
    if(keys){
      query = query + "&keys=" + keys;
    }
    if(includes.length > 0){
      var includeStr = "";
      for (var i = 0; i < includes.length; i++) {
        includeStr += includes[i] + ",";
      }
      query = query + "&include=" + includeStr;
    }
    if(query == "where=") {
      return '';
    } else {
      return query;
    }
  }

  /**
   * Fetches a single moback object in the table
   * @param {String} rowId Required object id of the object in the table
   * @param {Function} callback
   */
  this.fetchSingle = function (rowId, callback) {
    if (rowTable){
      var query = "";
      if(includes.length > 0){
        var includeStr = "";
        for (var i = 0; i < includes.length; i++) {
          includeStr += includes[i] + ",";
        }
        query = query + "?include=" + includeStr;
      }
      var url = baseUrlAPI + "collections/" + rowTable + "/" + rowId + query;
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
        var mobackObj = new moback.objMgr(rowTable);
        mobackObj.createFromExistingObject(res);
        callback(mobackObj);
      }, headers);
    } else {
      callback("Query object is not set, please set a query object first");
    }
  };

  /**
   * Returns the total number of rows in a table
   * @param {Function} callback
   */
  this.getCount = function (callback) {
    if (rowTable){
      var query = formQuery();
      var url = baseUrlAPI + "collections/" + rowTable + "?op=count";
      //console.log("Query is:" + query);
      if(query != ""){
        url += "&" + query;
      }
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
        if(res.count){
          callback(res.count);
        } else {
          callback(0);
        }
      }, headers);
    } else {
      callback("Query object is not set, please set a query object first");
    }
  };

  /**
   * Set's a filter to the query so the key should equal to the value.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.equalTo = function (key, value){
    if (key && value){
      var newFilter = {};
      newFilter[key] = value;
      filters.push(newFilter);
      return ("Added filter: eq " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should NOT equal to the value.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.notEqualTo = function (key, value){
    if (key && value){
      var newFilter = {};
      newFilter[key] = { "$ne" : value };
      filters.push(newFilter);
      return ("Added filter: neq " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should be greater than the value.
   * Please use this filter on numeric values only.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.greaterThan = function (key, value){
    if (key  && value){
      var newFilter = {};
      newFilter[key] = {'$gt' : value};
      filters.push(newFilter);
      return ("Added filter: gt " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should be less than the value.
   * Please use this filter on numeric values only.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.lessThan = function (key, value){
    if (key && value){
      var newFilter = {};
      newFilter[key] = {'$lt' : value};
      filters.push(newFilter);
      return ("Added filter: lt " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should be greater or equal to the value.
   * Please use this filter on numeric values only.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.greaterThanOrEqualTo = function (key, value){
    if (key  && value){
      var newFilter = {};
      newFilter[key] = {'$gte' : value};
      filters.push(newFilter);
      return ("Added filter: gte " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should be less or equal to the value.
   * Please use this filter on numeric values only.
   * @param {String} key Key column in the table
   * @param {String} value Value that the column should match to
   * @returns {string} success message
   */
  this.lessThanOrEqualTo = function (key, value){
    if (key && value){
      var newFilter = {};
      newFilter[key] = {'$lte' : value};
      filters.push(newFilter);
      return ("Added filter: lte " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Set's a filter to the query so the key should be regex exp applied to key.
   * Please use this filter on string only.
   * @param {String} key Key column in the table
   * @param {String} value The regex expression to apply to the filter
   * @returns {string} success message
   */
  this.applyRegex = function (key, value){
    if (key && value){
      var newFilter = {};
      newFilter[key] = {'$regex' : value};
      filters.push(newFilter);
      return ("Added filter: regex " + key + " : " + value);
    } else {
      return ("Key and value are required");
    }
  };

  /**
   * Exists, filters the query so the value for the table has to exist
   * @param {String} key Key column of the table
   * @returns {string} message
   */
  this.exists = function (key){
    if (key){
      var newFilter = {};
      newFilter[key] = {'$exists' : true};
      filters.push(newFilter);
      return ("Added filter: exists " + key);
    } else {
      return ("value for exists has to be set");
    }
  };

  /**
   * Does not exists, filters the query so the value for the table has to be empty or null
   * @param {String} key Key column of the table
   * @returns {string} message
   */
  this.doesNotExist = function (key){
    if (key){
      var newFilter = {};
      newFilter[key] = {'$exists' : false};
      filters.push(newFilter);
      return ("Added filter: does not exist " + key);
    } else {
      return ("value for does not exist has to be set");
    }
  };

  /**
   * Sets a filter so the results are within a geopoint location
   * @param {String} key Key column of the table
   * @param {Number} lat The latitude of the target geopoint.
   * @param {Number} lon The longitude of the target geopoint.
   * @param {Number} distance Optional distance value
   * @param {String} distanceUnits Optional distance unit (km | mi | degrees), defaults to degrees
   * @returns {string}
   */
  this.near = function (key, lat, lon, distance, distanceUnits){
    if (key && lat && lon){
      var geoPoint = {
        "__type": "GeoPoint",
        "lat": lat,
        "lon": lon
      };
      var newFilter = {};
      newFilter[key] = {'$near' : geoPoint};
      if (distance){
        var distanceLabel = '$maxDistance';
        if(distanceUnits){
          if(distanceUnits == "km"){
            distanceLabel = '$maxDistanceInKms';
          } else if(distanceUnits == "mi"){
            distanceLabel = '$maxDistanceInMiles';
          }
        }
        newFilter[key][distanceLabel] = distance;
      }
      filters.push(newFilter);
      return ("Added filter: near " + key + " : " + geoPoint);
    } else {
      return ("Key and geopoints are required");
    }
  };

  /**
   * A geopoint filter to find geopoints within a set of gepoints
   * @param {String} key Key column of the table
   * @param {Array} geoPoints Array of geopoints to find geoppoints within
   * @returns {string}
   */
  this.within = function (key, geoPoints){
    if (key && geoPoints){
      if(geoPoints.length < 2){
        return "At least two geopoints are required";
      }
      //construct the query
      var geoPointArray = [];
      for (var i = 0; i < geoPoints.length; i++) {
        geoPointArray.push(geoPoints[i].getValue());
      }
      var newFilter = {};
      newFilter[key] = {'$within' : { "$box": geoPointArray } };
      filters.push(newFilter);
      return ("Added filter: within " + key + " : " + geoPoints);
    } else {
      return ("Key and geopoints are required");
    }
  };

  /**
   * Returns all the current filters applied to the query
   * @returns {Array}
   */
  this.getFilters = function (){
    return filters;
  };

  /**
   * Resets all the current filters applied to the query
   * @returns {string} success message
   */
  this.resetFilters = function (){
    filters = [];
    return ("filters reset");
  };

  /**
   * Limits the number of rows returned by the query
   * @param {Number} value Numbers of rows to be returned
   * @returns {string}
   */
  this.limit = function (value){
    if (value){
      limit = value;
      return ("Set limit to " + value);
    } else {
      return ("Limit value required");
    }
  };

  /**
   * Implements skip on the query. To skip first 5, pass 5 to value
   * @param {Number} value expects number value. Set to 0 or false to disable
   * @returns {string}
   */
  this.skip = function (value){
    if (value){
      skip = value;
      return ("Set skip to " + value);
    } else {
      return ("Limit value required");
    }
  };

  /**
   * Sets the query mode to 'and' or 'or'
   * @param {String} value and/or
   * @returns {string}
   */
  this.queryMode = function (value){
    if (value == "and" || value == "or"){
      queryMode = value;
      return ("Set query mode to " + value);
    } else {
      return ("queryMode has to be 'and' or 'or'");
    }
  };

  /**
   * Implements the ascending order of the column on the query.
   * @param {String} key Key column of the table
   * @returns {string}
   */
  this.ascending = function (key){
    if (key){
      order = key;
      return ("Set ascending mode for " + key);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * Implements the descending order of the column on the query.
   * @param {String} key Key column of the table
   * @returns {string}
   */
  this.descending = function (key){
    if (key){
      order = "-" + key;
      return ("Set descending mode for " + key);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * On query of an object, return the results of whole object in pointer columns
   * @param {String} key Key column of the table
   * @returns {string}
   */
  this.include = function (key){
    if (key){
      includes.push(key);
      return ("Add include for " + key);
    } else {
      return ("value has to be set");
    }
  };



  /**
   * Only return the columns selected
   * @param {Arrays/String} value Array of key columns of the table or Single Column
   * @returns {string}
   */
  this.select = function (value){
    if (value){
      if(typeof value == "string"){
        keys = value;
      } else {
        var keysToPass = "";
        for (var i = 0; i < value.length; i++) {
          keysToPass = keysToPass + value[i] + ",";
        }
        keys = keysToPass;
      }
      return ("Restrict columns only to " + keys);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * Only return the rows with the values in column
   * @param {String} key Key column of the table
   * @param {Array} value Array of values to test against
   * @returns {string}
   */
  this.containedIn = function (key, value){
    if (value){
      var newFilter = {};
      newFilter[key] = {'$in' : value};
      filters.push(newFilter);
      return ("Filtered " + key + " column with " + value);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * Only return the rows with the values not contained in column
   * @param {String} key Key column of the table
   * @param {Array} value Array of values to test against
   * @returns {string}
   */
  this.notContainedIn = function (key, value){
    if (value){
      var newFilter = {};
      newFilter[key] = {'$nin' : value};
      filters.push(newFilter);
      return ("Filtered " + key + " column without " + value);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * Only return the rows with the array contained in column
   * Only do this for column with array type
   * @param {String} key Key column of the table
   * @param {Array} value Array of values to test against
   * @returns {string}
   */
  this.containsAll = function (key, array){
    if (array){
      var newFilter = {};
      newFilter[key] = {'$all' : array};
      filters.push(newFilter);
      return ("Filtered " + key + " now has to contain " + array);
    } else {
      return ("array has to be set");
    }
  };

  /**
   * Drops the table associated with the query object
   * @param {Function} callback
   */
  this.dropTable = function(callback) {
      if (rowTable){
          var url = baseUrlAPI + "schema/" + rowTable;
          var headers = {
              'X-Moback-Environment-Key': envKey,
              'X-Moback-Application-Key': appKey
          };
          microAjax('DELETE', url, function (res) {
              callback(res);
          }, headers);
      } else {
          callback("Table does not exist, please check the table name");
      }
  };


};
