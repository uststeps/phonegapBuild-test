var slideout;

var app = {
    initialize: function() {
        this.bindEvents();
		app.initTopbar();
		//app.initDrawer();
	
	
    },
	
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
	onDeviceReady: function() {
        app.receivedEvent('deviceready');
		app.onLoad();
		
	
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
	
	onLoad: function() {

		$('#selectionTable tr').click(function() {
			var ids = $(this).find("input").attr("id");
		for(i=1; i<4;i++){
			if ("level" + i.toString()==ids) {
				$("#level" + i.toString()).prop('checked', true);
				localStorage.setItem("selectedLevel", i);
			}
		}
	
		});
		
	},
	
	onLevelSelect: function() {
		if (localStorage.getItem("selectedLevel") != "none") {
			navigator.notification.alert(
					"Please select which application you are applying for.",     
					null,          
					"",        
					'Ok'             
				);
		}	
	}

	
};
