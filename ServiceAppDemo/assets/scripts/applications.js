var Application = Backbone.Model.extend({
	defaults: {
		application_uri: ''
	}
});

var Applications = Backbone.Collection.extend({
	model: Application
});

window.allApplications = new Applications;

var initApplications = function() {
	$.ajax({
		url: "https://wwws.appfirst.com/api/v3/applications/",
		dataType: "jsonp",
		crossDomain: true,
		success: function(data) {
			_.each(data, function(app) {
				var application = new Application(app);
				allApplications.add(application);
				console.log(application);
			});
		},
		error: function(e) {
			console.log(e);
		}
	});
}

