//###################		INITS
var totalUpload = 0;
var uploadCounter=0
var uploading = false;
var finishedUploading = false;
var toUploads = new Array();
//################################
var app = {
    initialize: function() { this.bindEvents();},
	
    bindEvents: function() { document.addEventListener('deviceready', this.onDeviceReady, false);},
	
	onDeviceReady: function() {
		totalUpload = 0;	
		app.receivedEvent('deviceready');
    },
	
    receivedEvent: function(id) { },

	//##     Base64String to Data Blob 		##
	b64toBlob: function(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

		var blob = new Blob(byteArrays, {type: contentType});
		return blob;
	},
	
	
	//## 	DataBlob >> File 		##
	savebase64AsImageFile: function(folderpath,filename,content,contentType, onSuccess){
    
		var DataBlob = app.b64toBlob(content,contentType);
    
		console.log("Starting to write the file :3");
		window.resolveLocalFileSystemURL(folderpath, function(dir) {
			console.log("Access to the directory granted successfully");
			dir.getFile(filename, {create:true,exclusive: false}, function(fileNew) {
				console.log("File created successfully.");
				//alert('file created');
				fileNew.createWriter(function(fileWriter) {
				console.log("Writing content to file");
				fileWriter.write(DataBlob);
				fileWriter.onwriteend = function(evt){
					//alert("write end: " + evt);
					onSuccess();
				};
					console.log("### FOLDER PATH: ### : " + folderpath);
				}, function(){
					console.log('Unable to save file in path '+ folderpath);
				});
			});
		});
	},

	onDivClick: function(obj){
		navigator.notification.confirm(
			"Remove?",         // message
			function(buttonIndex) {
				if (buttonIndex == 1) {
					$(obj).remove();
				};
			},                 // callback
			"",           // title
			['Remove', 'Cancel']                 // buttonName
		);
	},
	
	getURI: function(){
		//alert("test2");
		navigator.camera.getPicture(function(imageUri) {
			
			//file.writeFolder(cordova.file.externalRootDire);
			var eDir = cordova.file.dataDirectory;
				
				app.deleteFile(eDir, "up" + totalUpload.toString() +  ".jpg", 
					function(entry){
						//alert("file deleted, trying to create");
						app.savebase64AsImageFile( eDir ,"up" + totalUpload.toString() +  ".jpg",imageUri,"image/jpeg", function(){
						//alert("File deleted setting source");
							var src=eDir + "up" + totalUpload.toString() + ".jpg";
						//alert("source set: " + src);
						//alert("flag: " + totalUpload);
							$("#toUploadGrid").append(
								"<div id='" + "div" + totalUpload.toString() + "' class='grid-item'><img class=\"" + src + "\" src=\"data:image/jpg;base64," + imageUri + "\" /><br/>" + 
								" <progress class='generalProgress' value='0' max='100'></progress> "
								+"</div>" 
							);
						
							$("#div" + totalUpload).on("click", function(){
								app.onDivClick(this);
							});
						//alert("image appended");
							totalUpload++;
				
						});
					},
					function(){
						//alert("file not deleted");
					},
					
					function(){
						//alert("file missing, trying to create");		
						app.savebase64AsImageFile( eDir ,"up" + totalUpload.toString() +  ".jpg",imageUri,"image/jpeg", function(){
						//alert("File missing setting source");
						
							var src=eDir + "up" + totalUpload.toString() + ".jpg";
						//alert("source set: " + src);
						//alert("flag: " + totalUpload);
							$("#toUploadGrid").append(
								"<div id='" + "div" + totalUpload.toString() + "' class='grid-item'><img class=\"" + src + "\" src=\"data:image/jpg;base64," + imageUri + "\" /><br/>" + 
								" <progress class='generalProgress' value='0' max='100'></progress> "
								+"</div>" 
							);
							
							$("#div" + totalUpload).on("click", function(){
								app.onDivClick(this);
							});
						//alert("image appended");
							totalUpload++;
				
						});
					}
				);
				
				

			
		
		}, function(error) {
			//alert("ERROR: "  + error);
		}, 
		{
			destinationType	: 	Camera.DestinationType.DATA_URL,
			sourceType 		:	Camera.PictureSourceType.SAVEDPHOTOALBUM
		}
		);

		//alert("Test");
	},


	deleteFile: function (directory, fileToDelete, onSuccess, onFail, onMissing) {
		//alert("trying to delete");
		window.resolveLocalFileSystemURL(directory, function(dir) {

			dir.getFile(fileToDelete, {create: false,exclusive: false}, function (fileEntry) {
				fileEntry.remove(onSuccess, onFail);

			}, onMissing);
		});
		//alert("Delete process done");
	},
	
	
	uploadPhotos: function(fileName) {

			window.cordova.plugin.ftp.upload( fileName, '/uploaded' + uploadCounter.toString() + ".jpg", function(percent) {
					if (percent == 1) {
						console.log("############################################################# FINISHED UPLOADING");
						if (uploadCounter<toUploads.length) {
							
							uploadCounter++;
							console.log(" ####### UPLODING ####### NUMBER: " + uploadCounter);
						};
						
						if (uploadCounter>=toUploads.length) {
							finishedUploading=true;
						};
						$('.generalProgress').val(100);
						uploading=false;
					} else {
						console.debug("ftp: upload percent=" + percent * 100 + "%");
						console.log("download progress:" +  percent * 100);
					}
				}, function(error) {
					console.log("####################################################ftp: upload error=" + error);
				});
				
					
		
		
	},
	
	onUploadSubmit: function() {
		
		

			navigator.notification.confirm(
				"Upload images?",         // message
				function(buttonIndex) {
					if (buttonIndex == 1) {
						
						
						window.cordova.plugin.ftp.connect('ftp.dlptest.com', 'dlpuser@dlptest.com', 'eiTqR7EMZD5zy7M', function(ok) {
							console.log("###################################################################ftp: connect ok=" + ok);
							var counter=0;
							$("#toUploadGrid").children('div').each(function () {
								//totalUpload++;
								toUploads[counter] = $(this).children('img').attr('class');
								counter++;
							});

							var arrayLength = toUploads.length;
							for (var i = 0; i < arrayLength; i++) {
								//alert(toUploads[i]);
								//Do something
							};
							
							var intervalUpload = setInterval(function(){ 
								if (!uploading && !finishedUploading) {
									console.log("########  File Start Uploading");
									uploading=true;
									app.uploadPhotos(toUploads[uploadCounter]);
								};
								if (finishedUploading) {
									clearInterval(intervalUpload);
								};
							}, 1);
						}, function(error) {
							console.log("################################################ftp: connect error=" + error);
							alert("Upload Connection Error");
						});
										

					};
				},                 // callback
				"",           // title
				['Upload', 'Cancel']                 // buttonName
			);

		//alert("Upload Finished");
				
	}

		
};
