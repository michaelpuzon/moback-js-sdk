Files
=====

Moback.fileMgr lets you store application files in the cloud that would otherwise be too large or cumbersome to
fit into a regular moback object. The most common use case is storing images, but you can also use it for documents,
videos, music, and any other binary data.

Creating a file
---------------
A moback file can created by using a blob:

              var content = '<a id="a"><b id="b">hey!</b></a>'; // the body of the new file...
              var blob = new Blob([content], { type: "text/xml"});
              mobackFile = new Moback.fileMgr(blob, "test.xml");
              mobackFile.save(ssotoken,function(data){
                console.log(data);
              });

But most commonly for HTML5 apps, you'll want to use an html form with a file upload control. On modern browsers, this is easy.
Create a file input tag which allows the user to pick a file from their local drive to upload:

              <input type="file" id="file-select" name="fileupload" />
              var fileSelect = document.getElementById('file-select');
              mobackFile = new Moback.fileMgr(fileSelect.files[0]);
              mobackFile.save(ssotoken,function(data){
                console.log(data);
              });

Removing a file
---------------
A file can be removed at any time. The user must be logged in to do this.

              mobackFile.removeFile(SSOToken, function(data){
                console.log(data);
              });

