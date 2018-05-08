
var globals = {

	gotoPage: function(page){
		if (page=="index.html") {
			window.location.replace(page);
		}else{
			window.location = page;
		};
	}

}