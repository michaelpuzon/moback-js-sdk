/**
 * Testing File Manager
 */

describe("Moback File Manager", function() {
    var timestamp = new Date().getTime();
    var mobackUser, mobackTestObject, mobackFileObject;
    var moObj = {
        "movieName" : "The Imitation Game"
    };
    var objData = {};
    var userData = {};
    var userObj = {
        "userId":"user" + timestamp,
        "password":"asdf1234",
        "email":"mike" + timestamp + "@gmail.com",
        "firstname":"Uday",
        "lastname":"nayak"
    };

    var fileUploaded = false;
    var propertiesSet = false;
    var objectSaved = false;
    var fileRemoved = false;

    /**
     * Test object instantiation of User Manager
     */
    it("should be able to instantiate a moback user", function() {
        var mobackTestUser = new Moback.userMgr();
        expect(typeof mobackTestUser.createUser).toBe("function");
    });

    /**
     * Test user creation
     */
    it("should create a user",function(done){
        mobackUser = new Moback.userMgr();
        mobackUser.createUser(userObj,function(data){
            for(var prop in data) {
                userData[prop] = data[prop];
            }
            console.log(data);
            expect(data.objectId).toBeTruthy();
            done();
        });
    });

    /**
     * Test user login
     */
    it("should login the created user",function(done){
        mobackUser.login(userObj.userId,userObj.password,function(data){
            for(var prop in data) {
                userData[prop] = data[prop];
            }
            console.log(data);
            expect(userData.ssotoken).toBeDefined();
            done();
        });
    });


    it('should be able to instantiate a moback file object', function(done){

       var fileSelect = document.getElementById('file-select');
       function uploadFile(){
           if(fileSelect.files.length == 0) {
               setTimeout(uploadFile, 50);
               console.log("Waiting for you to choose a file");
               return;
           }
           else {
               mobackFileObject = new Moback.fileMgr(fileSelect.files[0]);
               mobackFileObject.save(userData.ssotoken,function(data){
                   console.log(data);
                   expect(data.message).toEqual("Upload File Operation Successful");
               });
               fileUploaded = true;
           }

       }
       uploadFile();

       done();
    });

    /**
     * Test object instantiation of Objects Manager
     */
    it("should be able to instantiate a moback object", function(done) {
        mobackTestObject = new Moback.objMgr("Movie");
        expect(typeof mobackTestObject.createObject).toBe("function");
        done();
    });

    /**
     * To test set, unset and get methods
     */
    it("should set properties of the created object", function(done){
        function waitForFileUpload(){
            if(fileUploaded == false){
                setTimeout(waitForFileUpload, 5000);
                //console.log("Waiting for file upload");
            }
            else {
                mobackTestObject.set("Lead","Benedict Cumberbatch");
                mobackTestObject.set("genre","Thriller");
                mobackTestObject.set("duration","30 Minutes");
                mobackTestObject.set("MoviePic",mobackFileObject);
                propertiesSet = true;
            }
        }
        waitForFileUpload();
        done();
    });

    /**
     * To test if the object was successfully saved
     */
    it("should save an object" ,function(done){
        function waitForPropertiesToBeSet() {
            if(propertiesSet == false) {
                setTimeout(waitForPropertiesToBeSet, 5000);
                //console.log("waiting for properties");
            }
            else {
                mobackTestObject.save(function(data){
                    console.log(data);
                    expect(data.objectId).toBeTruthy();
                });
                objectSaved = true;
            }
        }
        waitForPropertiesToBeSet();
        done();
    });

    /**
     * Test remove file
     */

    it("should remove the uploaded file", function(done){
        function removeFile(){
            if(objectSaved == false) {
                setTimeout(removeFile, 5000);
            }
            else {
                mobackFileObject.removeFile(userData.ssotoken, function(data){
                    console.log(data);
                    expect(data.code).toEqual("1000");
                });
                fileRemoved = true;
            }
        }
        removeFile();
        done();
    });

    /**
     * Test object deletion
     */

/*    it("should delete the object", function(done){
        function deleteObject() {
            if(fileRemoved == false){
                setTimeout(deleteObject, 20000);
                console.log("waiting");
            }
            else {
                mobackTestObject.remove(function(data){
                    console.log(data);
                    expect(data.success).toEqual(true);
                })
            }
        }
        deleteObject();
        done();
    });*/

});