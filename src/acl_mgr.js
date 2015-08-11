/**
 * ACL manager allows you to set permissions to a moback object.
 * @param {Object} fileName Filename to be used for the file
 * @param {File} fileData The actual file data
 */
moback.aclMgr = function (existingACL) {

  var acl = {};

  if(existingACL){
    acl = existingACL;
    /*
    delete acl.createdBy;
    for (var i = 0; i < acl.userWrite.length; i++) {
      delete acl.userWrite[i].ruleType;
      delete acl.userWrite[i].userId;
    }
    */
  } else {
    acl = {
      "globalRead": true,
      "globalWrite": true,
      "userRead": [],
      "userWrite": [],
      "groupRead": [],
      "groupWrite": []
    };
  }

  /**
   * Sets the acl's public write permission
   * @param {Boolean} flag boolean flag to set this variable true or false
   */
  this.setPublicWritePermission = function(flag){
    acl.globalWrite = flag;
    return "Public Permission set";
  };

  /**
   * Sets the acl's public read permission
   * @param {Boolean} flag boolean flag to set this variable true or false
   */
  this.setPublicReadPermission = function(flag){
    acl.globalRead = flag;
    return "Public Permission set";
  };

  /**
   * Add or remove a role to the role write permission list
   * @param {String} role role name to add
   * @param {Boolean} flag boolean flag to set this role to write, or remove role
   */
  this.setRoleWritePermission = function(role, flag){
    for (var i = 0; i < acl.groupWrite.length; i++) {
      if (acl.groupWrite[i].roleName == role){
        if(flag){
          return 'Role already in the permission list';
        } else {
          acl.groupWrite.splice(i, 1);
          return 'Role write permission removed';
        }
      }
    }
    if(flag){
      acl.groupWrite.push({roleName: role});
      return 'Role permission added';
    } else {
      return 'Could not find role permission to remove';
    }
  };

  /**
   * Add or remove a role to the role read permission list
   * @param {String} role role name to add
   * @param {Boolean} flag boolean flag to set this role to write, or remove role
   */
  this.setRoleReadPermission = function(role, flag){
    for (var i = 0; i < acl.groupRead.length; i++) {
      if (acl.groupRead[i].roleName == role){
        if(flag){
          return 'Role already in the permission list';
        } else {
          acl.groupRead.splice(i, 1);
          return 'Role read permission removed';
        }
      }
    }
    if(flag){
      acl.groupRead.push({roleName: role});
      return 'Role permission added';
    } else {
      return 'Could not find role permission to remove';
    }
  };

  /**
   * Add or remove a role to the role write permission list
   * @param {String} user user id to add
   * @param {Boolean} flag boolean flag to set this user to write, or remove user
   */
  this.setUserWritePermission = function(user, flag){
    for (var i = 0; i < acl.userWrite.length; i++) {
      if (acl.userWrite[i].userObjectId == user){
        if(flag){
          return 'User already in the permission list';
        } else {
          acl.userWrite.splice(i, 1);
          return 'User write permission removed';
        }
      }
    }
    if(flag){
      acl.userWrite.push({userObjectId: user});
      return 'User permission added';
    } else {
      return 'Could not find User permission to remove';
    }
  };

  /**
   * Add or remove a user to the user read permission list
   * @param {String} user user id to add
   * @param {Boolean} flag boolean flag to set this user to write, or remove user
   */
  this.setUserReadPermission = function(user, flag){
    for (var i = 0; i < acl.userRead.length; i++) {
      if (acl.userRead[i].userObjectId == user){
        if(flag){
          return 'User already in the permission list';
        } else {
          acl.userRead.splice(i, 1);
          return 'User read permission removed';
        }
      }
    }
    if(flag){
      acl.userRead.push({userObjectId: user});
      return 'User permission added';
    } else {
      return 'Could not find User permission to remove';
    }
  };

  this.getACL = function(){
    return acl;
  };

  /**
   * Returns the whole acl object in json form
   */
  this.getInfo = function(){
    return JSON.stringify(acl);
  };


};
