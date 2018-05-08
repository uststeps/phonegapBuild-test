var slideout;
var app = {
    initialize: function() {
        this.bindEvents();
		//app.initTopbar();
		//app.initDrawer();
		app.setupNotification();
	
    },
	
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
	onDeviceReady: function() {
        app.receivedEvent('deviceready');
		app.onLoad();
		

		
		localStorage.setItem("selectedLevel", "none");
		
    },
	
    receivedEvent: function(id) {
       
    },
	
	
	initDrawer: function() {
		$('#menu').load('nav.html #navigation', function() {
			//$("#nav_nameHolder").html(localStorage.getItem("lastName") + ", " + localStorage.getItem("firstName"));
			//$("#nav_idHolder").html(localStorage.getItem("studentID"));
		});
				

	   slideout = new Slideout({
        'panel': document.getElementById('panel'),
        'menu': document.getElementById('menu'),
        'padding': 256,
        'tolerance': 70
       });
	   	localStorage.setItem("menuOpened", "false");
	
	},
	
	initTopbar: function() {

		$('#topbarHolder').load('topbar.html #topbardiv', function() {
			 document.querySelector('.toggle-button').addEventListener('click', function() {
				slideout.toggle();
			});
			
		});
	},
	
	setupNotification: function() {
		
	},
	
	toggleSubs: function(list) {
		$("#sub" + list).toggle();
	},
	
	toggleSubs: function(list) {
		$("#sub" + list).toggle();
	},
	

	gotoPage: function(page) {
		if (page=="index.html") {
			window.location.replace(page);
		}else{
			window.location = page;
		};
	},


	onLoad: function(){
		

		window.cordova.plugin.ftp.connect('ftp.dlptest.com', 'dlpuser@dlptest.com', 'eiTqR7EMZD5zy7M', function(ok) {
			alert("ftp: connect ok=" + ok);
		
			
		}, function(error) {
			alert("ftp: connect error=" + error);
		});

		
		$("#referenceInput").on('input', function () {
			if (this.value.length > 14)
				this.value = this.value.slice(0,14); 
		});

	
	},
	
	onLogin: function(){
		
		if ($("#referenceInput").val() == "" || $("#referenceInput").val() == null) {
			navigator.notification.alert(
					"Reference number cannot be empty.",     
					null,          
					"",        
					'Ok'             
				);
		} else if ($("#surnameInput").val() == "" || $("#referenceInput").val() == null) {
			navigator.notification.alert(
					"Surname cannot be empty.",
					null,          
					"",         
					'Ok'                
				);
		} else {
			//globals.gotoPage('registration-template.html'); //Temporary Redirection
		}
		
		
	}
	
	
	
	
};
