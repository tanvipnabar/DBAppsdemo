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
			var counter = 0;
			_.each(data, function(app) {
				if (counter < 80) {
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
											processID: 123,
											attribute: "cpu",
											lowThreshold: 20,
											highThreshold: 80
										},
										{
											processID: 456,
											attribute: "memory",
											lowThreshold: 1400000,
											highThreshold: 2000000
										}
		]
	}
})

var Components = Backbone.Collection.extend({
	model: Component
})

function clicked(e) {
	console.log(e);
		$.ajax({
			url: "https://wwws.appfirst.com/api/v3/applications/"+e+"/processes",
			dataType: "jsonp",
			crossDomain: true,
			success: function(data) {
				console.log(data);
				$('#process-container').empty();
				
				var componentData = components.get(e);
				
				//component name
				$('#process-container').append('<h2>'+componentData.get('name')+'</h2>');
				
				//HEALTH
				$('#process-container').append('<p><b>Health: </b>'+componentData.get('health')+'</p>');
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
	$.ajax({
		url: url,
		dataType: "jsonp",
		crossDomain: true,
		success: function(data) {
			//console.log(data);
			$.each(data, function(i, details) {
				//console.log(details);
				_.each(details, function(i, datt) {
					$('#'+theuid+' .content ul').append('<li><b>'+datt+': </b>'+details[datt]+'</li>');
				});
				//$('#'+theuid+' .content ul').append('<li><b>CPU: </b>'+details['cpu']+'</li>');
				//$('#'+theuid+' .content ul').append('<li><b>Memory: </b>'+details['memory']+'</li>');
				//$('#'+theuid+' .content ul').append('<li><b>Page faults: </b>'+details['page_faults']+'</li>');
			});
		},
		error: function(e) {
			console.log(e);
		}
	});
}	