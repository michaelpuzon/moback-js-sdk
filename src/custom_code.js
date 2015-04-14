/**
 * Custom code allows you to define functions that are to be executed in the cloud.
 */
moback.customCode = function () {
  var mobackCloudFunctions = [];

  /**
   * Define a new custom code function.
   * @param {String} name A unique function name
   * @param {Function} callback Callback should be in function(request, response) format
   */
  this.define = function (name, callback) {
    mobackCloudFunctions.push({name: name, callback: callback})
  };

  /**
   * Returns the current cloud functions defined
   * @returns {Array}
   */
  this.cloudFunctions = function(){
    return mobackCloudFunctions;
  };

};