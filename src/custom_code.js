/**
 * Custom code allows you to define functions that are to be executed in the cloud.
 * @constructor
 */
moback.customCode = function () {
  moback.customCode.mobackCloudFunctions = [];

  /**
   * Returns the current cloud functions defined
   * @returns {Array}
   */
  this.cloudFunctions = function(){
    return moback.customCode.mobackCloudFunctions;
  };
};

/**
 * Define a new custom code function.
 * @param {String} name A unique function name
 * @param {Function} callback Callback should be in function(request, response) format
 */
moback.customCode.define = function (name, callback) {
  if(moback.customCode.mobackCloudFunctions == undefined){
    moback.customCode.mobackCloudFunctions = [];
  }
  moback.customCode.mobackCloudFunctions.push({name: name, callback: callback})
};