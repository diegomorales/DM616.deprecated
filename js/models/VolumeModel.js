// VolumeModel.js

define([ 
  'underscore', 
  'backbone'
], 	function( _, Backbone){
	
	var VolumeModel = Backbone.Model.extend({
		defaults:	{
			volume:	80,
			min: 	0,
			max:	100,
		},
		
		initialize: function(){
			this.set('node', audiocontext.createGain());
			
			this.on('change:volume', this.setVolume);
			
			this.setVolume();
		},
		
		setVolume:	function(){
			this.get('node').gain.value = this.get('volume')/100;
		},
	});
	
  	return VolumeModel;
});