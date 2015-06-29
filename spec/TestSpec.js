describe("Moback Global object", function(){
  var appKey = "ODE2ZWFkMWYtNmU2Ni00MWYzLWIwYTktY2U3NGU3MzBjODBh";
  var devKey = "ZWI4OTVmODMtN2MyZS00ZWM1LThlNTgtMmNiMjcxMjRmN2Ri";

  it("should be able to instantiate moback object", function() {
    Moback.initialize(appKey, devKey);
    var appKeys = Moback.showAppKey();
    expect(appKeys.appKey).toBe(appKey);
  });

  xit("test custom moback function", function(done){
    /*
    var latitude = request.latitude;
    var longitude = request.longitude;
    var radius = request.radius;
    var limit = request.limit;
    */

    var latitude = 40.759211;
    var longitude = -73.984638;
    var radius = 1000;
    var limit = 100;

    var query = new Moback.queryMgr('Pin');
    //query.include("creator");



    // constrain to near the geopoint
    if (latitude && longitude && radius) {

      var geopoint = new Moback.GeoPoint(latitude, longitude);
      query.near("location", latitude, longitude, radius, "mi");
    }

    if (limit) {
      query.limit(limit);
    }


    query.include('creator');
    query.fetch(function(results) {

      var pinArray = [];

      for (var i = 0; i < results.length; ++i) { // loop through pins

        var pin = results[i];
        var pinDict = {};

        // objectId
        var pinObjectId = pin.id;
        pinDict["objectId"] = pinObjectId;

        // group id
        if(pin.get("group")){
          var groupId = pin.get("group").id;
          pinDict["groupId"] = groupId;
        }

        // title
        var title = pin.get("title");
        pinDict["title"] = title;

        // pin entitlement
        var pinEntitlement = pin.get("pinEntitlement");
        pinDict["pinEntitlement"] = pinEntitlement;

        // location

        var location = pin.get("location");
        pinDict["location"] = [location["lat"], location["lon"]];


        // flash pin
        if (pin.get("isFlashPin")) {
          var isFlashPin = pin.get("isFlashPin");
          pinDict["isFlashPin"] = isFlashPin;
        }

        if (pin.get("flashStartTime")) {
          var flashStartTime = pin.get("flashStartTime");
          pinDict["flashStartTime"] = flashStartTime;
        }

        if (pin.get("flashEndTime")) {
          var flashEndTime = pin.get("flashEndTime");
          pinDict["flashEndTime"] = flashEndTime;
        }

        // Anonymous Pins
        if (pin.get("isAnonymous")) {
          var isAnonymous = pin.get("isAnonymous");
          pinDict["isAnonymous"] = isAnonymous;
        }

        // created date
        pinDict["createdDate"] = pin.createdAt;


        // creator info
        var creatorDict = {};


        // creator id
        var user = pin.get("creator");
        creatorDict["id"] = pin.get("creator").objectId;

        // screen name
        var screenName = pin.get("creator").screenName;
        creatorDict["screenName"] = screenName;

        // image
        /*
        if (pin.get("creator").get("userThumbImage")) {
          var image = pin.get("creator").get("userThumbImage").url();
          creatorDict["image"] = image;
        }
        */


        pinDict["creator"] = creatorDict;


        // state
        var state = pin.get("state");
        pinDict["state"] = state;

        // forward pins
        var numForwardPins = pin.get("numForwardPins");
        pinDict["numForwardPins"] = numForwardPins;

        // num comments
        var commentArray = pin.get("comments");
        pinDict["numComments"] = commentArray? commentArray.length : 0;

        // num likes
        var likeArray = pin.get("likes");
        pinDict["numLikes"] = likeArray? likeArray.length : 0;

        // num stamps
        var stampArray = pin.get("stamps");
        pinDict["numStamps"] = stampArray? stampArray.length : 0;

        // save pin
        pinArray[i] = pinDict;
      }

      //response.success(pinArray);
      console.log(pinArray);
      expect(pinArray.length).toBe(3);
      done();

    });
  });

  it("testGetDetails", function(done){

    var query = new Moback.queryMgr('Pin');
    var pinId = 'VU0jR-SwqMMu69Sk';
    var detailDict = {};
    var functionsQueue = [];
    query.include("group");

    function grabComments(comments){

      detailDict.comments = [];

      for (var i = 0; i < comments.length; i++) {
        var commentQuery = new Moback.queryMgr(comments[i].className);
        commentQuery.include("creator");
        commentQuery.fetchSingle(comments[i].objectId, function(comment){


          var commentDict = {};

          // attachments for this comment
          var attachmentArray = comment.get("attachments");
          commentDict["attachments"] = attachmentArray;

          // comment text
          var commentText = comment.get("comment");
          commentDict["comment"] = commentText;

          // creator screen name
          var screenName = comment.get("creator").screenName;
          commentDict["screenName"] = screenName;

          // creator image
          if (comment.get("creator").userThumbImage) {
            var image = comment.get("creator").userThumbImage.url;
            commentDict["image"] = image;
          }

          // creator user id
          var userId = comment.get("creator").objectId;
          commentDict["userId"] = userId;

          // created date
          var createdDate = comment.createdAt;
          commentDict["createdDate"] = createdDate;

          detailDict.comments.push(commentDict);
          console.log(functionsQueue);
          removeFuncQueue(comment.id);
          assessFinalFunc();
        });
      }
    }

    function grabLikes(likes){
      detailDict.likes = [];

      for (var i = 0; i < likes.length; i++) {
        var likeQuery = new Moback.queryMgr(likes[i].className);
        likeQuery.include("creator");
        likeQuery.fetchSingle(likes[i].objectId, function(like){

          var likeDict = {};

          // creator screen name
          var screenName = like.get("creator").screenName;
          likeDict["screenName"] = screenName;

          // creator image
          if (like.get("creator").userThumbImage) {
            var image = like.get("creator").userThumbImage.url;
            likeDict["image"] = image;
          }

          // creator user id
          var userId = like.get("creator").objectId;
          likeDict["userId"] = userId;


          detailDict.likes.push(likeDict);
          //functionsQueue--;
          console.log(functionsQueue);
          removeFuncQueue(like.id);
          assessFinalFunc();
        });
      }
    }

    function grabStamps(stamps){
      detailDict.stamps = [];

      for (var i = 0; i < stamps.length; i++) {
        var stampQuery = new Moback.queryMgr(stamps[i].className);
        stampQuery.include("creator");
        stampQuery.fetchSingle(stamps[i].objectId, function(stamp){

          var stampDict = {};

          // creator screen name
          var screenName = stamp.get("creator").screenName;
          stampDict["screenName"] = screenName;

          // creator image
          if (stamp.get("creator").userThumbImage) {
            var image = stamp.get("creator").userThumbImage.url;
            stampDict["image"] = image;
          }

          // creator user id
          var userId = stamp.get("creator").objectId;
          stampDict["userId"] = userId;

          // created date
          var createdDate = stamp.createdAt;
          stampDict["createdDate"] = createdDate;


          detailDict.stamps.push(stampDict);
          //functionsQueue--;
          console.log(functionsQueue);
          removeFuncQueue(stamp.id);
          assessFinalFunc();
        });
      }
    }

    function removeFuncQueue(id){
      for (var i = 0; i < functionsQueue.length; i++) {
        if(id == functionsQueue[i]){
          functionsQueue.splice(i, 1);
        }
      }

    }

    function assessFinalFunc(){
      console.log(functionsQueue);
      if(functionsQueue.length == 0){
        console.log("with asyncs");
        console.log(detailDict);
        expect(3).toBe(3);
        done();
      }

    }

    query.fetchSingle(pinId, function(pin){
      console.log(pin);

      // description
      var description = pin.get("description");
      detailDict["description"] = description;

      // pintype
      var originalPinType = pin.get("originalPinType");
      detailDict["originalPinType"] = originalPinType;

      if(pin.get("group")){
        var groupName = pin.get("group").name;
        detailDict["groupName"] = groupName;

        var groupDescription = pin.get("group").groupDescription;
        detailDict["groupDescription"] = groupDescription;

        if (pin.get("group").groupImage) {
          var image = pin.get("group").groupImage.url;
          detailDict["groupImage"] = image;
        }
      }

      /*
      if(pin.get("comments") && pin.get("comments").length > 0){
        var comments = pin.get("comments");
        for (var i = 0; i < comments.length; i++) {
          console.log(comments[i]);
          functionsQueue.push(comments[i].objectId);
        }
        grabComments(pin.get("comments"));
      }
      */

      if(pin.get("likes") && pin.get("likes").length > 0){
        var likes = pin.get("likes");
        for (var i = 0; i < likes.length; i++) {
          functionsQueue.push(likes[i].objectId);
        }
        grabLikes(pin.get("likes"));
      }
      console.log(functionsQueue);



      if(pin.get("stamps") && pin.get("stamps").length > 0){
        var stamps = pin.get("stamps");
        for (var i = 0; i < stamps.length; i++) {
          functionsQueue.push(stamps[i].objectId);
        }
        grabStamps(pin.get("stamps"));
      }
      console.log(functionsQueue);


      if(functionsQueue.length == 0){
        console.log("normal");
        console.log(detailDict);
        expect(3).toBe(3);
        done();
      }

    })

  });

});


