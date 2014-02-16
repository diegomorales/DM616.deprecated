// ChannelCollection.js

define([
 // 'jquery',    
  'underscore', 
  'backbone',
  'models/ChannelModel'
], 	function( _, Backbone, channel){
	
	var ChannelCollection = Backbone.Collection.extend({
		model: channel,
		
		initialize:	function(){	},
	});

  	return ChannelCollection;

});