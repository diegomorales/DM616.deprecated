// MeterModel.js

define([  
  'underscore', 
  'backbone'
], 	function( _, Backbone){
	
	var MeterModel = Backbone.Model.extend({		
		defaults:{
			buffer_size: 4096
		},
		
		initialize:	function(){
			this.set('meter', audiocontext.createScriptProcessor(this.get('buffer_size'),2,2));	
		},
	});

  	return MeterModel;
});