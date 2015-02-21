/**
 * The Query manager object. Pass table parameter on query object creation to use right away.
 * If table parameter is omitted, please use set table function afterwards.
 * @param table - table name
 */
moback.queryMgr = function (table) {
  var baseUrlAPI = baseUrl + 'objectmgr/api/';
  var rowTable = table || false;
  var filters = [];
  var limit = false;
  var skip = false;
  var order = false;
  var keys = false;
  var queryMode = "and";

  this.setTable = function (table) {
    rowTable = table;
    return "Query object has been changed to table " + table;
  };

  this.fetch = function (callback) {
    if (rowTable){
      var query = "?where=";
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

      var url = baseUrlAPI + "collections/" + rowTable + query;
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
        if(res.results){
          var objArray = [];
          for (var i = 0; i < res.results.length; i++) {
            var mobackObj = new Moback.objMgr(res.results[i]);
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

  this.fetchSingle = function (rowId, callback) {
    if (rowTable){
      var url = baseUrlAPI + "collections/" + rowTable + "/" + rowId;
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
        var mobackObj = new Moback.objMgr(rowTable);
        mobackObj.createFromExistingObject(res);
        callback(mobackObj);
      }, headers);
    } else {
      callback("Query object is not set, please set a query object first");
    }
  };

  this.getCount = function (callback) {
    if (rowTable){
      var url = baseUrlAPI + "collections/" + rowTable;
      var headers = {
        'X-Moback-Environment-Key': envKey,
        'X-Moback-Application-Key': appKey
      };
      microAjax('GET', url, function (res) {
        callback(res);
      }, headers);
    } else {
      callback("Query object is not set, please set a query object first");
    }
  };

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
   * Exists, filters the query so the value for the table has to exist
   * @param value
   * @returns {string} message
   */
  this.exists = function (value){
    if (value){
      var newFilter = {};
      newFilter[value] = {'$exists' : true};
      filters.push(newFilter);
      return ("Added filter: exists " + value);
    } else {
      return ("value for exists has to be set");
    }
  };

  /**
   * Does not exists, filters the query so the value for the table has to be empty or null
   * @param value
   * @returns {string} message
   */
  this.doesNotExist = function (value){
    if (value){
      var newFilter = {};
      newFilter[value] = {'$exists' : false};
      filters.push(newFilter);
      return ("Added filter: does not exist " + value);
    } else {
      return ("value for does not exist has to be set");
    }
  };


  this.getFilters = function (){
    return filters;
  };

  this.resetFilters = function (){
    filters = [];
    return ("filters reset");
  };

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
   * @param value expects number value. Set to 0 or false to disable
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
   * @param value and/or
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
   * @param value expects paramter/column value.
   * @returns {string}
   */
  this.ascending = function (value){
    if (value){
      order = value;
      return ("Set ascending mode for " + value);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * Implements the descending order of the column on the query.
   * @param value expects paramter/column value.
   * @returns {string}
   */
  this.descending = function (value){
    if (value){
      order = "-" + value;
      return ("Set descending mode for " + value);
    } else {
      return ("value has to be set");
    }
  };

  /**
   * Only return the columns selected
   * @param value expects paramter/column value.
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
   * @param key
   * @param value
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
   * @param key
   * @param value
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
   * @param key
   * @param array
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





};
