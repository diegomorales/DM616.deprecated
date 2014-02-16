// BusCollection.js

define([
 // 'jquery',    
  'underscore', 
  'backbone',
  'models/VolumeModel'
], 	function( _, Backbone, VolumeModel){
	
	var BusCollection = Backbone.Collection.extend({
		model: VolumeModel,
		
		initialize:	function(){},
	});

  	return BusCollection;

});