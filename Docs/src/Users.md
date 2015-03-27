Users
=====
User accounts lets users access their information in a secure manner. For this, we provide a special
class called Moback.usrMgr.

Moback.usrMgr is a subclass of Moback.objMgr. This enables to use "get", "set", "save", "fetch", and 
all other methods and properties that Moback.objMgr provides.

This class handles all the functionality needed for user account management.

Properties
----------

Each Moback user has the following required properties:
    - userId: The userId for the user
    - password: The password for the user
    - email: The email address of the user
In addition to these properties, user may have other properties like first name, last name and properties
specific to the application.

Create a User
-------------

The following example illustrates creating a user:

          //Instatiate a moback user object
          var mobackUser = new Moback.userMgr();

          //Set properties of the user object
          mobackUser.set("userId", "john");
          mobackUser.set("password", "mypassword");
          mobackUser.set("email", "john@gmail.com");
          mobackUser.set("firstname", "John");
          mobackUser.set("lastname","Doe");

          mobackUser.createUser(userData, function(data){
                console.log(data);
          });

This will create a user in your Moback App.


Log In
------

To login a user after creating the user, you can use the login method.

          mobackUser.login("moback_app_userId","moback_app_pwd", function(data){
                console.log(data);
          });


Fetch User Information
----------------------

To fetch the details of the logged in user, the class method getUserDetails can be used.

          mobackUser.getUserDetails(function(data) {
                console.log(data);
          });

Log In a User with a Session Token
------

To re-login a user using a session token, you can use the loginWithSessionToken method.

          var sessionToken = mobackUser.getSessionToken(); //save this for use later
          
          mobackUser.loginWithSessionToken(sessionToken, function(data){
                console.log(data);
          });

Password Reset
--------------

In most common cases, where users forget their passwords, the SDK provides a method to reset passwords.

          mobackUser.resetPassword("john@gmail.com", function(data) {
                console.log(data);
          });

This will send an email with a link to reset password to the user's specified email address.

Update User
-----------

At any time, a user is free to update user information as long as the user is logged in. For example, if a
user would like to update the last name:

          mobackUser.set("lastname", "Mayer");
          mobackUser.updateUser(function(data{
                console.log(data);
          });


Delete User
-----------

Moback.userMgr provides a method deleteUser provides to delete a user.

          mobackUser.deleteUser(function (data) {
                console.log(data);
          });