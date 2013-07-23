var Application = Backbone.Model.extend({
	defaults: {
		application_uri: ''
	}
});

var Applications = Backbone.Collection.extend({
	model: Application
});

window.allApplications = new Applications;

var theData = {nodes: []};

var initApplications = function() {
	$.ajax({
		url: "https://wwws.appfirst.com/api/v3/applications/",
		dataType: "jsonp",
		crossDomain: true,
		success: function(data) {
			window.components = new Components();
			window.componentsView = new ComponentsView({collection: components});
			var counter = 0;
			_.each(data, function(app) {
				if (counter < 30) {
					var application = new Application(app);
					allApplications.add(application);
					//console.log(application);
					var component = new Component(app);
					components.add(component);	
					counter++;			
				}
				
			});
			theData.nodes = components.toJSON();
			drawGraph(); //render.js
		},
		error: function(e) {
			console.log(e);
		}
	});
}

var Component = Backbone.Model.extend({
	defaults: {
		id: -1,
		name: 'component name',
		health: 2,
		healthParams: [	{
											processID: "996_29233_12995843702000000",
											attribute: "cpu",
											lowThreshold: 0.55,
											highThreshold: 0.92
										},
										{
											processID: "996_29242_12995843702000000",
											attribute: "memory",
											lowThreshold: 50067070,
											highThreshold: 70067070
										}
		]
	}
});

var ComponentsView = Backbone.View.extend({
	el: $('#healthvalue'),
	initialize: function() {
    this.collection.bind('change', this.render, this);
	},
	render: function(e) {
		alert(e.get('health'));
		$(this.el).html(e.get('health'));
	}
});


var Components = Backbone.Collection.extend({
	model: Component
})

function clicked(e) {
	//console.log(e);
		$.ajax({
			url: "https://wwws.appfirst.com/api/v3/applications/"+e+"/processes",
			dataType: "jsonp",
			crossDomain: true,
			success: function(data) {
				console.log(data);
				$('#process-container').empty();
				
				var componentData = components.get(e);
				
				//check for bad health
				setHealth(componentData);
				//component name
				$('#process-container').append('<h2>'+componentData.get('name')+'</h2>');
				//HEALTH
				$('#process-container').append('<p><b>Health: </b>'+components.get(e).get('health')+'</p>');
				$('#process-container').append('<h3>Health parameters:</h3>');
				var healths = componentData.get('healthParams');
				console.log(healths);
				_.each(healths, function(param) {
					console.log(param);
					$('#process-container').append('<li>'+param['attribute']+' for process id: '+param['processID']+'<br>');
					$('#process-container').append('lower threshold: '+param['lowThreshold']+'<br>');
					$('#process-container').append('upper threshold: '+param['highThreshold']+'</li><br><br>');
				});
				
				//PROCESSES
				$('#process-container').append('<h3>Processes:</h3>');

				$.each(data, function(i, process) {
					$('#process-container').append(
	            '<section class="section" id="'+process['uid']+'">\
	              <p class="title" id="title'+process['uid']+'"><a href="#">'+process['name']+'</a></p>\
	              <div class="content" data-slug="panel1">\
	              <ul class="no-disc"></ul></div>\
	            </section>'					
						).hide().fadeIn('fast');
					processData(process['uid']);
				});
			},
			error: function(e) {
				console.log(e);
			}
		});
}

function processData(theuid) {
	var url = "https://wwws.appfirst.com/api/processes/"+theuid+"/data/";
	console.log(theuid)
	$.ajax({
		url: url,
		dataType: "jsonp",
		crossDomain: true,
		success: function(data) {
			$.each(data, function(i, details) {
				_.each(details, function(i, datt) {
					$('#'+theuid+' .content ul').append('<li><b>'+datt+': </b>'+details[datt]+'</li>');
				});

			});
		},
		error: function(e) {
			console.log(e);
		}
	});
}	



function setHealth(component) {
	var params = component.get('healthParams');
	_.each(params, function(param) {
		var url = "https://wwws.appfirst.com/api/processes/"+param['processID']+"/data/";
		$.ajax({
			url: url,
			dataType: "jsonp",
			crossDomain: true,
			success: function(theProcess) {
				var currentLevel = theProcess[0][param['attribute']];
				console.log('this should come before healthlevel');
				if (currentLevel > param['lowThreshold']) {
					component.set({health: 1});
				}
				if (currentLevel > param['highThreshold']) {
					component.set({health: 1});
				}
			},
			error: function(e) {
				console.log(e);
			}
		});
	});
}