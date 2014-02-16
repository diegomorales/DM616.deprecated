// TransportModel.js

define([   
  'underscore', 
  'backbone'
], 	function( _, Backbone){
	
	var TransportModel = Backbone.Model.extend({
		defaults:{
			transport_time: 0	
		},
	});

  	return TransportModel;
});