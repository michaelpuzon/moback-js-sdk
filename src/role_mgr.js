/**
 * Moback Role Mgr allows you to create roles to assign to users for permissions.
 */
moback.roleMgr = function (roleName) {
  moback.objMgr.call(this, "__roleSettings"); //inherit the moback obj mgr

  var self = this;

  if(roleName){
    self.set('roleName', roleName);
  }

  /**
   * creates a moback role
   * role name has to be set before creation
   * @param {Function} callback Will output either success or failed message.
   */
  this.createRole = function (callback) {
    if(self.get("roleName") == "Property does not exist"){
      callback("role name is not set");
      return;
    }
    if(self.id){
      callback("Role already created");
    } else {
      self.save(callback);
    }
  };

  /**
   * creates a shortcut to users relations
   * will return a users relation method
   */
  this.users = function () {
    return self.relation('assigned');
  };



};