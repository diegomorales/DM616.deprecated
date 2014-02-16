// MeterCollection.js

define([
 // 'jquery',    
  'underscore', 
  'backbone',
  'models/MeterModel'
], 	function( _, Backbone, MeterModel){
	
	var MeterCollection = Backbone.Collection.extend({
		model: MeterModel,
		
		initialize:	function(){},
	});

  	return MeterCollection;

});